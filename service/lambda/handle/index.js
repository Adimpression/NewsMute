console.log('Loading function');

var doc = require('dynamodb-doc');
var validator = require('validator');

var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: "handle",
    level: 'debug',
    src: true
});

var dynamo = new doc.DynamoDB();

/**
 * Receives events of new account addition under humanId.
 * Inserts this handle information to the Handle table.
 *
 * @param event from SNS, initially disparched by a sync event on Cognito:NewsMute
 * @param context used to obtain which user synced
 */
exports.handler = function (event, context) {
    console.log('event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));

    var message = event.Records[0].Sns.Message;

    log.info('Message:' + message);

    var cognitoEvent = JSON.parse(message);

    switch (cognitoEvent.datasetName) {
        case "syncTime":
            log.info("Ignoring syncTime");
            break;
        case "humanId":
            log.debug("cognitoEvent.datasetRecords.v1.newValue:" + cognitoEvent.datasetRecords.v1.newValue)
            log.debug("context.identity.cognitoIdentityId:" + cognitoEvent.identityId);

            if (!validator.isNull(cognitoEvent.datasetRecords.v1.newValue)) {
                dynamo.putItem(
                    {
                        'TableName': 'Handle',
                        'Item': {
                            'handle': cognitoEvent.datasetRecords.v1.newValue,
                            'me': cognitoEvent.identityId
                        }
                    }
                    , context.done);
            } else {
                log.info("Ignoring empty value for cognitoEvent.datasetRecords.v1.newValue");
            }
            break;
        default:
            log.info("Unknown datasetName:" + event.datasetName);
    }
};


