console.log('Starting to Scream');

var doc = require('dynamodb-doc');
var AWS = require("aws-sdk");


var dynamo = new doc.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var dynamoDBYawnParser = require('./ts/ParseYawnGet');

exports.handler = function (event, context) {
    console.log('event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));

    var events;

    switch (event.method) {
        case 'GET':
            events = event.query.events;
            break;
        case 'POST':
            events = event.body.events;
    }

    JSON.parse(events).forEach(function (action) {
            "use strict";
            var operation = action.operation;

            switch (operation) {
                case 'create':
                    action.payload.forEach(function (item) {
                        dynamo.putItem(
                            {
                                'TableName': 'Stalk',
                                'Item': {
                                    'me': context.identity.cognitoIdentityId,
                                    'ref': item
                                }
                            }
                            , context.done);
                    });
                    break;
                case 'delete':
                    console.log("Deleting");
                    action.payload.forEach(function (item) {
                        console.log("Deleting item:" + item);
                        dynamo.deleteItem(
                            {
                                'TableName': 'Stalk',
                                'Key': {
                                    'me': context.identity.cognitoIdentityId,
                                    'ref': item
                                }
                            }
                            , function (error, dataFromStalk) {
                                if (error != null) {
                                    console.log(error);
                                }

                                dynamo.query(
                                    {
                                        'TableName': 'Yawn',
                                        'KeyConditionExpression': '#me = :me and begins_with(#ref, :mood)',
                                        'FilterExpression': '#source = :source',
                                        'ExpressionAttributeNames': {
                                            '#me': 'me',
                                            '#ref': 'ref',
                                            '#source': 'source'
                                        },
                                        'ExpressionAttributeValues': {
                                            ':me': context.identity.cognitoIdentityId,
                                            ':mood': '1',
                                            ':source': item
                                        }
                                    }, function (error, dataFromYawn) {
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
                                                        console.log(error);
                                                    } else {
                                                        console.log("Removed:" + item.me + '/' + item.ref);
                                                    }
                                                });
                                        });
                                    });
                            });
                    });
                    break;
                case 'list':
                    dynamo.query(
                        {
                            'TableName': 'Stalk',
                            'KeyConditionExpression': "me = :me",
                            'ExpressionAttributeValues': {
                                ':me': context.identity.cognitoIdentityId
                            }
                        }
                        , context.done);
                    break;
                default:
                    context.fail(new Error('Unrecognized operation "' + operation + '"'));
            }
        }
    );
};
