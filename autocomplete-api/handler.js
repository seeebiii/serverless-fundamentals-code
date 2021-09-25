"use strict";

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient({});
const tableName = process.env.CITY_TABLE_NAME;

module.exports.autocomplete = async (event) => {
  const country = event.queryStringParameters['country'] || 'Germany';
  const query = event.queryStringParameters['query'];

  const params = {
    TableName: tableName,
    KeyConditionExpression: 'country = :hkey and begins_with(city,:rkey)',
    ExpressionAttributeValues: {
      ':hkey': country,
      ':rkey': query
    }
  };

  const result = await documentClient.query(params).promise();
  const suggestions = result.Items;

  return {
    statusCode: 200,
    body: JSON.stringify({ suggestions }, null, 2)
  };
};
