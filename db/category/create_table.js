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
  TableName: "DA2Category",
  KeySchema: [{
    AttributeName: "_categoryID",
    KeyType: "HASH"
  }],
  AttributeDefinitions: [{
    AttributeName: "_categoryID",
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
      "Created table DA2Category. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});