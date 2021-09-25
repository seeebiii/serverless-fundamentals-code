'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient({});
const tableName = process.env.CITY_TABLE_NAME;
const csvSeparator = ',';
const batchSize = 25;

module.exports.worker = async (event) => {
  console.log('Receiving event: ', JSON.stringify(event));

  const records = event.Records || [];
  const putRequests = records.flatMap(record => {
    const rows = record.body.split('\n');

    return rows.map(row => {
      // one row looks like: 1,Berlin,52.5167,13.3833,Germany,DE,primary
      const columns = row.split(csvSeparator);

      return {
        PutRequest: {
          Item: {
            id: columns[0],
            city: columns[1],
            lat: columns[2],
            lng: columns[3],
            country: columns[4]
          }
        }
      };
    });
  });

  console.log('put requests: ', JSON.stringify(putRequests));

  const numberOfBatches = Math.ceil(putRequests.length / batchSize);

  for (let i = 0; i < numberOfBatches; i++) {
    const start = i * batchSize;
    const putRequestsBatch = putRequests.slice(start, start + batchSize);
    const requestData = {
      RequestItems: {
        [tableName]: putRequestsBatch
      }
    };

    console.log('Batch write request to DynamoDB: ', JSON.stringify(requestData));

    await documentClient.batchWrite(requestData).promise();
  }
};
