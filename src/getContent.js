const AWS = require('aws-sdk');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getDesignbyId(id) {
    let design;

    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { "id": id },
        }).promise();
        design = result.Item;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!design) {
        throw new createError.InternalServerError(`Design with ID "${id}" not found`);
    }

    return design;
}

async function getContent(event, context) {
    let design;
    const { id } = event.pathParameters;
    design = await getDesignbyId(parseInt(id, 10));


    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: design.content
    };
}

export const handler = getContent;
