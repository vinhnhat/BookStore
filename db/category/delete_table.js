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
  TableName: "DA2Category"
};

dynamodb.deleteTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to delete table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Deleted table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});