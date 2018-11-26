var Cart = require("../models/cart");
var awsConnect = require('./aws-connect')
var rename = require('./edit_name');

var get_home_book = (req, res) => {
  var params_book = {
    TableName: "DA2Book",
    ProjectionExpression: '#bookID, theloai, tieude, hinhanh, gia, danhdau, linkseo',
    ExpressionAttributeNames: {
      '#bookID': '_bookID'
    }
    /*
    Limit: 50
    FilterExpression: 'contains(#d, :d1) or contains(#d, :d2) or contains(#d, :d3)',
    ExpressionAttributeNames: {
      '#bookID': '_bookID',
      '#d': 'danhdau'
    },
    ExpressionAttributeValues: {
      ':d1': 'new',
      ':d2': 'weekdeal',
      ":d3": 'popular'
    }*/
  };
  
  // Duyệt sách 
  awsConnect.docClient.scan(params_book, (err, data) => {
    if (err) {
      console.log('Error: ', JSON.stringify(err, null, 2));
      res.render('error');
    } else {
      console.log('Books count: ', data.Count);
      if (!req.session.cart) {
        return res.render("user/pages/home", {
          products: [], //cartItem
          allBooks: data.Items,
          totalPrice: 0,
          totalQty: 0
        });
      }

      // trong phiên
      var cart = new Cart(req.session.cart);
      res.render('user/pages/home', {
        products: cart.generateArray(),
        allBooks: data.Items,
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

var get_detail = (req, res, next) => {
  var id = req.params.id;

  var params = {
    TableName: "DA2Book",
    KeyConditionExpression: "#bookID = :id",
    ExpressionAttributeNames: {
      "#bookID": "_bookID"
    },
    ExpressionAttributeValues: {
      ":id": id
    }
  };

  awsConnect.docClient.query(params, function (err, data) {
    if (err) {
      console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      //console.log(data.Items);

      if (!req.session.cart) {
        return res.render("user/pages/detail", {
          products: [], //cartItem
          book: data.Items,
          totalPrice: 0,
          totalQty: 0
        });
      }

      // trong phiên
      var cart = new Cart(req.session.cart);
      res.render('user/pages/detail', {
        products: cart.generateArray(),
        book: data.Items,
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
}; 

var show_list_cat = function (req, res, next) {
  var category = req.params.theloai;
  console.log(category);
  var params = {
    TableName: "DA2Book",
    FilterExpression: "#tl=:tloai",
    ExpressionAttributeValues: {
      ":tloai": category
    },
    ExpressionAttributeNames: {
      "#tl": "theloai"
    }
  };

  awsConnect.docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("\nSố lượng tìm dc=" + data.Count);
      if (!req.session.cart) {
        return res.render("user/pages/list-book-cat", {
          products: [],
          allBooks: data.Items,
          totalPrice: 0,
          totalQty: 0
        });
      }
      //ngược lại đang trong phiên session
      var cart = new Cart(req.session.cart);
      res.render("user/pages/list-book-cat", {
        allBooks: data.Items,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

var show_list_cat2 = function (req, res, next) {
  var dd = req.params.danhdau;
  console.log(dd);
  var params = {
    TableName: "DA2Book",
    FilterExpression: 'contains(#dd, :danhdau)',
    ExpressionAttributeValues: {
      ":danhdau": dd
    },
    ExpressionAttributeNames: {
      "#dd": "danhdau"
    }
  };

  awsConnect.docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("\nSố lượng tìm dc=" + data.Count);
      if (!req.session.cart) {
        return res.render("user/pages/list-book-cat", {
          products: [],
          allBooks: data.Items,
          totalPrice: 0,
          totalQty: 0
        });
      }
      //ngược lại đang trong phiên session
      var cart = new Cart(req.session.cart);
      res.render("user/pages/list-book-cat", {
        allBooks: data.Items,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

var search_book = function (req, res, next) {
  var q = req.query.q;
  var cat = req.query.cat;

  q = rename.editName(q);

  //console.log(q);
  //console.log(cat);

  if (typeof(cat) === 'undefined' || cat === 'cat0') {
    var params = {
      TableName: "DA2Book",
      FilterExpression: "contains(linkseo, :ls)",
      ExpressionAttributeValues: {
        ":ls": q
      }
    };
  } else {
    var params = {
      TableName: "DA2Book",
      FilterExpression: "contains(linkseo, :ls) and #tl=:tloai",
      ExpressionAttributeValues: {
        ":tloai": cat,
        ":ls": q
      },
      ExpressionAttributeNames: {
        "#tl": "theloai"
      }
    };
  }

  awsConnect.docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("\nSố lượng tìm dc=" + data.Count);
      if (!req.session.cart) {
        return res.render("user/pages/list-book-cat", {
          products: [],
          allBooks: data.Items,
          totalPrice: 0,
          totalQty: 0
        });
      }
      //ngược lại đang trong phiên session
      var cart = new Cart(req.session.cart);
      res.render("user/pages/list-book-cat", {
        allBooks: data.Items,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

exports.get_home_book = get_home_book;
exports.get_detail = get_detail;
exports.show_list_cat = show_list_cat;
exports.show_list_cat2 = show_list_cat2;
exports.search_book = search_book;