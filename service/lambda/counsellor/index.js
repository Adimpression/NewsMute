console.log('Starting to Counsel');

var _ = require('highland');


var cheerio = require('cheerio');
var doc = require('dynamodb-doc');
var http = require('http');
var request = require('request');

var kinesisParser = require('./ts/KinesisParser');
var dynamoDBParser = require('./ts/DynamoDBParser');
var dynamoDBHandleParser = require('./ts/DynamoDBHandleParser');

var dynamo = new doc.DynamoDB();

var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: "counsellor",
    level: 'debug',
    src: true
});

/**
 * Receives Kinesis Stream data whenever a user shares information via Scream, to the Scream table.
 * Inserts received data into Yawn of all friends.
 *
 * @param event from AWS Kinesis
 * @param context not related to logic, but used to respond back
 */
exports.handler = function (event, context) {
    console.log('event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));


    _(new kinesisParser.Parse().rootObject(event).Records).flatFilter(function (entry) {

        return _(function (pushFunc2, next) {
            var record = new kinesisParser.Parse().record(entry);

            switch (record.eventName) {
                case "INSERT":

                    var me = record.dynamodb.NewImage.me.S;
                    var link = record.dynamodb.NewImage.ref.S;

                    log.debug(me);
                    log.debug(link);

                    request(link, function (error, response, html) {
                        if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);
                            var title = $('title').text();
                            var content = $('meta[name=description]').attr("content");

                            dynamo.query(
                                {
                                    'TableName': 'SuperFriend',
                                    'KeyConditionExpression': "me = :me",
                                    'ExpressionAttributeValues': {
                                        ':me': me
                                    }
                                }, function (error, dataFromSuperFriend) {
                                    if (error != null) {
                                        log.error(error);
                                        pushFunc2(error, false);
                                        return;
                                    }

                                    log.debug(dataFromSuperFriend);

                                    log.info("number_of_friends:" + dataFromSuperFriend.Items.length);

                                    dynamo.deleteItem({
                                        'TableName': 'Scream',
                                        'Key': {
                                            'me': me,
                                            'ref': link
                                        }
                                    }, function () {
                                        _(new dynamoDBParser.Parse().rootObject(dataFromSuperFriend).Items)
                                            .flatFilter(
                                                function (element) {
                                                    return _(function (pushFunc, next) {
                                                        dynamo.query(
                                                            {
                                                                'TableName': 'Handle',
                                                                'KeyConditionExpression': "handle = :handle",
                                                                'ExpressionAttributeValues': {
                                                                    ':handle': element.friend
                                                                }
                                                            }, function (error, dataFromHandle) {
                                                                log.debug(dataFromHandle);
                                                                var items = new dynamoDBHandleParser.Parse().rootObject(dataFromHandle).Items;
                                                                if (items.length == 1) {
                                                                    log.debug("Shocking the item");
                                                                    dynamo.updateItem({
                                                                        'TableName': 'Yawn',
                                                                        'Key': {
                                                                            'me': {
                                                                                'S': items[0].friend
                                                                            },
                                                                            'ref': {
                                                                                'S': '1' + link
                                                                            }
                                                                        },
                                                                        'UpdateExpression': "SET shocks = shocks + :val",
                                                                        'ExpressionAttributeValues': {
                                                                            ":val":1
                                                                        },
                                                                        ReturnValues: "UPDATED_NEW"
                                                                    }, function (err, data) {
                                                                        if (err) {
                                                                            log.debug("Shocking item failed. Error JSON:", JSON.stringify(err, null, 2));

                                                                            dynamo.putItem({
                                                                                    'TableName': 'Yawn',
                                                                                    'Item': {
                                                                                        'me': items[0].friend,
                                                                                        'ref': '1' + link,
                                                                                        'title': title,
                                                                                        'content': content,
                                                                                        'shocks': 0
                                                                                    }
                                                                                }
                                                                                , function () {
                                                                                    log.debug("Added data for " + JSON.stringify(items[0]));
                                                                                    pushFunc(null, true);
                                                                                });

                                                                        } else {
                                                                            log.debug("Shocking succeeded:", JSON.stringify(data, null, 2));
                                                                        }
                                                                    });

                                                                } else {
                                                                    log.info("No handles to input data to");
                                                                    pushFunc(null, true);
                                                                }
                                                            });
                                                    });
                                                })
                                            .done(
                                                function (err, results) {
                                                    if (err) {
                                                        log.error(error);
                                                        pushFunc2(error, false);
                                                    } else {
                                                        log.debug(results);
                                                        pushFunc2(null, true);
                                                    }
                                                });
                                    });

                                });
                        } else {
                            log.error('HTTP Status Code:' + response.statusCode);
                            pushFunc2('HTTP Status Code:' + response.statusCode, true);
                        }
                    });
                    break;
                default:
                    log.info("Ignored eventName:" + record.eventName);
                    pushFunc2(null, true);
            }
        });

    }).done(function () {
        context.done();
    });


};

