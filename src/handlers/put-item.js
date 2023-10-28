// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const AWS = require('aws-sdk');

// Get the DynamoDB table name from environment variables
const tableName = process.env.EVENT_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    console.info('New version');

    AWS.config.update({ region: 'us-west-1' });
    const docClient = new AWS.DynamoDB.DocumentClient();


    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);

    const id = body.booking.pk;
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const start = body.booking.availability.start_at;
    const end = body.booking.availability.end_at;
    const item = body.booking.availability.item.name;
    const itemId = body.booking.availability.item.pk;
    const status = body.booking.status;
    const booking = body.booking;

    const pk = id.toString();

    let response = {};

    try {
        const params = {
            TableName: tableName,
            Item: { id: pk, company: 'SEAFORTH', start: start, end: end, item: item, item_id: itemId, status: status, booking: booking, createdAt: createdAt, updatedAt: updatedAt }
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
