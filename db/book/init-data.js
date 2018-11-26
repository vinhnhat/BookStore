var AWS = require('aws-sdk');
var fs = require('fs');
var rename = require('../../controllers/edit_name');
var key = require('../../../aws-key.json');

AWS.config.update({
  accessKeyId: key.accessKeyId,
  secretAccessKey: key.secretAccessKey,
  region: key.region,
  endpoint: key.endpoint
});

var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing users into DynamoDB. Please wait.");

var allBooks = JSON.parse(fs.readFileSync("./book-data.json", "utf8"));
allBooks.forEach(function (book) {
  var params = {
    TableName: "DA2Book",
    Item: {
      _bookID: book._bookID,
      tacgia: book.tacgia,
      tieude: book.tieude,
      theloai: book.theloai,
      sotrang: book.sotrang,
      SKU: book.SKU,
      ngayxuatban: book.ngayxuatban,
      nhaxuatban: book.nhaxuatban,
      nhaphathanh: book.congtyphathanh,
      kichthuoc: book.kichthuoc,
      mota: book.mota,
      dichgia: book.dichgia,
      ngonngu: book.ngonngu,
      tinhtrang: book.tinhtrang,
      ngaythem: book.ngaythem,
      danhdau: book.danhdau,
      linkseo: rename.editName(String(book.tieude)),
      gia: book.gia,
      hinhanh: book.hinhanh
    }
  };
  console.log(params.Item.linkseo);
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add book",
        book._bookID,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Put User succeeded:", book._bookID);
    }
  });
});