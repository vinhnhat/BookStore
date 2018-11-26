var AWS = require('aws-sdk');
var fs = require('fs');
var key = require('../../../aws-key.json');

AWS.config.update({
  accessKeyId: key.accessKeyId,
  secretAccessKey: key.secretAccessKey,
  region: key.region,
  endpoint: key.endpoint
});

var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing users into DynamoDB. Please wait.");

var allCats = JSON.parse(fs.readFileSync("./cat-data.json", "utf8"));
allCats.forEach(function (cat) {
  var params = {
    TableName: "DA2Category",
    Item: {
      '_categoryID': cat._categoryID,
      'tentheloai': cat.tentheloai,
    }
  };
  console.log(params.Item.linkseo);
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add book",
        cat._categoryID,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Put User succeeded:", cat._categoryID);
    }
  });
});