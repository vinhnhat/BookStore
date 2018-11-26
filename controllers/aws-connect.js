var AWS = require('aws-sdk');
var key = require('../../aws-key.json');

AWS.config.update({
  accessKeyId: key.accessKeyId,
  secretAccessKey: key.secretAccessKey,
  region: key.region,
  endpoint: key.endpoint
});

let docClient = new AWS.DynamoDB.DocumentClient();

exports.docClient = docClient;