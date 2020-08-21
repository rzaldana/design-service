const AWS = require('aws-sdk');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getDesigns(event, context) {
    let designs;

    try {
        const result = await dynamodb.scan({ TableName: 'designsTable' }).promise();
        designs = result.Items;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return ({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(designs)
    });
}

export const handler = getDesigns;