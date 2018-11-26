var AWS = require('aws-sdk');
var key = require('../../../aws-key.json');

AWS.config.update({
  accessKeyId: key.accessKeyId,
  secretAccessKey: key.secretAccessKey,
  region: key.region,
  endpoint: key.endpoint
});

var dynamodb = new AWS.DynamoDB();

var params = {
  TableName: "DA2Book",
  KeySchema: [{
    AttributeName: "_bookID",
    KeyType: "HASH"
  }],
  AttributeDefinitions: [{
    AttributeName: "_bookID",
    AttributeType: "S"
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 4,
    WriteCapacityUnits: 4
  }
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table DA2Book. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});