//http://www.markomedia.com.au/dynamodb-for-javascript-cheatsheet/

console.log('Starting to Harvest');

var doc = require('dynamodb-doc');
var AWS = require("aws-sdk");

var request = require('request');
var FeedParser = require('feedparser');
var bunyan = require('bunyan');
var _ = require('highland');
var Xray = require('x-ray');
var x = Xray();
var parse = require('./ts/Parse');

var dynamoDBYawnParser = require('./ts/ParseYawnGet');


var log = bunyan.createLogger({
    name: "harvest",
    level: 'info',
    src: true
});

var dynamo = new doc.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();


/**
 * Receives events from Cognito Sync, News Mute
 * Inserts data into yawn based on if it is a Website or Feed
 *
 * @param event originating from cognito sync of Cognito:NewsMute
 * @param context not used in logic but as a response
 */
exports.handler = function (event, context) {
    console.log('event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));

    event = JSON.parse(event.Records[0].Sns.Message);

    var HOUR_IN_MILLIS = 60 * 60 * 1000;
    var WEEK_IN_MILLIS = 7 * 24 * 60 * 60 * 1000;

    dynamo.query(
        {
            'TableName': 'Stalk',
            'KeyConditionExpression': "me = :me",
            'ExpressionAttributeValues': {
                ':me': event.identityId
            }
        }, function (error, dataFromStalk) {
            log.info(JSON.stringify(dataFromStalk));
            _(new parse.Parse().rootObject(dataFromStalk).Items)
                .flatFilter(
                    function (element) {
                        return _(function (pushFunc, next) {

                            var item = new parse.Parse().item(element);

                            var req = request(item.ref);
                            var feedparser = new FeedParser();

                            req.on('error', function (error) {
                                log.error(error);
                                pushFunc(null, true);
                            });

                            String.prototype.startsWith = function (stringSequence) {
                                return (this.indexOf(stringSequence) == 0);
                            };

                            req.on('response', function (res) {
                                var stream = this;

                                if (res.statusCode != 200) {
                                    return this.emit('error', new Error('Bad status code'));
                                }

                                var contentType = res.headers['content-type'];

                                log.info({
                                    'link': item.ref,
                                    'content-type': contentType
                                });

                                var isFeed = contentType.startsWith('application/rss+xml') || contentType.startsWith('application/rdf+xml') || contentType.startsWith('application/atom+xml') || contentType.startsWith('application/xml') || contentType.startsWith('text/xml');

                                if (isFeed) {
                                    log.info({
                                        feed: true
                                    });
                                    stream.pipe(feedparser);
                                } else {
                                    x(item.ref,
                                        {
                                            'title': 'title',
                                            'description': 'meta[name=description]',
                                            'h1': ['h1'],
                                            'h2': ['h2'],
                                            'h3': ['h3']
                                        }
                                    )(function (err, obj) {
                                        if (err) {
                                            pushFunc(err, false);
                                        } else {
                                            log.info(obj);
                                            log.info({
                                                'title': obj.title,
                                                'description': obj.description,
                                                'h1': obj.h1,
                                                'h2': obj.h2,
                                                'h3': obj.h3
                                            });

                                            var content = '';

                                            obj.h1.forEach(function (h1) {
                                                content += h1 + '.. '
                                            });
                                            obj.h2.forEach(function (h2) {
                                                content += h2 + '... '
                                            });
                                            obj.h3.forEach(function (h3) {
                                                content += h3 + '... '
                                            });


                                            dynamo.query(
                                                {
                                                    'TableName': 'Yawn',
                                                    'KeyConditionExpression': '#me = :me and begins_with(#ref, :mood)',
                                                    'FilterExpression': '#source = :source and #created_at < :created_at',
                                                    'ExpressionAttributeNames': {
                                                        '#me': 'me',
                                                        '#ref': 'ref',
                                                        '#source': 'source',
                                                        '#created_at': 'created_at'
                                                    },
                                                    'ExpressionAttributeValues': {
                                                        ':me': event.identityId,
                                                        ':mood': '0',
                                                        ':source': item.ref,
                                                        ':created_at': (new Date).getTime() - HOUR_IN_MILLIS//Since websites can get updated hourly
                                                    }
                                                }, function (error, dataFromYawn) {
                                                    if (error != null) {
                                                        log.error({error: error});
                                                        pushFunc(error, true);
                                                        return;
                                                    }

                                                    dynamo.putItem(
                                                        {
                                                            'TableName': 'Yawn',
                                                            'Item': {
                                                                'me': event.identityId,
                                                                'ref': '1' + item.ref,
                                                                'title': obj.title,
                                                                'content': content,
                                                                'link': item.ref,
                                                                'source': item.ref,
                                                                'created_at': (new Date).getTime()
                                                            }
                                                        },
                                                        function () {
                                                            log.info("Inserted scraped item into database");
                                                            pushFunc(null, true);
                                                        });
                                                });
                                        }
                                    });
                                }
                            });

                            feedparser.on('error', function (error) {
                                log.error(error);
                                pushFunc(null, true);
                            });

                            feedparser.on('readable', function () {

                                var streamedItems = _(this);

                                dynamo.query(
                                    {
                                        'TableName': 'Yawn',
                                        'KeyConditionExpression': '#me = :me and begins_with(#ref, :mood)',
                                        'FilterExpression': '#source = :source and #created_at < :created_at',
                                        'ExpressionAttributeNames': {
                                            '#me': 'me',
                                            '#ref': 'ref',
                                            '#source': 'source',
                                            '#created_at': 'created_at'
                                        },
                                        'ExpressionAttributeValues': {
                                            ':me': event.identityId,
                                            ':mood': '1',
                                            ':source': item.ref,
                                            ':created_at': (new Date).getTime() - WEEK_IN_MILLIS//Since items are unlikely to be updated
                                        }
                                    }, function (error, dataFromYawn) {
                                        if (error != null) {
                                            log.error({error: error});
                                            pushFunc(error, true);
                                            return;
                                        }

                                        var items = new dynamoDBYawnParser.ParseYawnGet().rootObject(dataFromYawn).Items;
                                        items.forEach(function (item) {
                                            docClient.delete(
                                                {
                                                    'TableName': 'Yawn',
                                                    'Key': {
                                                        "me": item.me,
                                                        "ref": item.ref
                                                    }
                                                }, function (error, ignored) {
                                                    if (error != null) {
                                                        log.error({error: error});
                                                    }
                                                });
                                        });

                                        streamedItems.flatFilter(function (streamedItem) {
                                                return _(function (pushFunc2, next2) {

                                                    dynamo.query(
                                                        {
                                                            'TableName': 'Yawn',
                                                            'KeyConditionExpression': 'me = :me and #ref = :moodref',
                                                            'ExpressionAttributeNames': {
                                                                '#ref': 'ref'
                                                            },
                                                            'ExpressionAttributeValues': {
                                                                ':me': event.identityId,
                                                                ':moodref': '0' + streamedItem.link
                                                            }
                                                        },
                                                        function (error, data) {
                                                            // log.info("error:" + JSON.stringify(error));
                                                            log.debug("data:" + JSON.stringify(data));

                                                            var presentInAlreadyReadItems = new parse.Parse().rootObject(data).Items.length != 0;

                                                            if (!presentInAlreadyReadItems) {
                                                                dynamo.putItem(
                                                                    {
                                                                        'TableName': 'Yawn',
                                                                        'Item': {
                                                                            'me': event.identityId,
                                                                            'ref': '1' + streamedItem.link,
                                                                            'title': streamedItem.title,
                                                                            'content': streamedItem.description,
                                                                            'link': streamedItem.link,
                                                                            'source': item.ref,
                                                                            'created_at': (new Date).getTime()
                                                                        },
                                                                        'ConditionExpression': 'attribute_not_exists(me)'
                                                                    },
                                                                    function () {
                                                                        log.info("Inserted item into database");
                                                                        pushFunc2(null, true);
                                                                    });
                                                            } else {
                                                                log.info("Ignoring dead item");
                                                                pushFunc2(null, true);
                                                            }


                                                        });
                                                });
                                            })
                                            .done(function () {
                                                log.info('inner done');
                                                pushFunc(null, true);
                                            });
                                    });

                            });
                        })
                            ;
                    })
                .done(
                    function (err, results) {
                        log.info('outer done');
                        context.done(null, event);
                    });
        });
};

