// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const AWS = require('aws-sdk');

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    console.info('New version');

    AWS.config.update({region: 'us-west-1'});
    const docClient = new AWS.DynamoDB.DocumentClient();


    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = body.booking.pk;
    const start = body.booking.availability.start_at;
    const end = body.booking.availability.end_at;
    const booking = body.booking;

    const pk = id.toString();

    console.info('id: ', pk);
    console.info('start: ', start);
    console.info('end: ', end);
    console.info('booking: ', booking);

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    let response = {};

    try {
        const params = {
            TableName : tableName,
            Item: { id : pk, name: booking }
        };
    
        const result = await docClient.put(params).promise();
    
        response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found. " + ResourceNotFoundException
        };
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
