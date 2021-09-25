const { SQS, S3 } = require("aws-sdk");

const sqs = new SQS();
const s3 = new S3();
const queueUrl = process.env.QUEUE_URL;
const batchSize = 25;

const downloadCsvFile = async (record) => {
  console.log('Record: ', JSON.stringify(record));

  const file = await s3.getObject({
    Bucket: record.s3.bucket.name,
    Key: record.s3.object.key
  }).promise();

  return file.Body.toString('utf-8');
};

const splitAndPublishRows = async (rows) => {
  const numberOfBatches = Math.ceil(rows.length / batchSize);

  for (let batchIndex = 0; batchIndex < numberOfBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const rowsOfBatch = rows.slice(start, start + batchSize);
    const messageBody = rowsOfBatch.join('\n');

    console.log('Sending SQS message with body: ', messageBody);

    await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: messageBody
    }).promise();
  }
}

module.exports.producer = async (event) => {
  console.log('Receiving event: ', JSON.stringify(event));

  const records = event.Records || [];

  for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
    const record = records[recordIndex];
    const fileContent = await downloadCsvFile(record);

    const rows = fileContent.split('\n');
    // remove first line because it contains metadata
    rows.splice(0, 1);

    await splitAndPublishRows(rows);
  }
};
