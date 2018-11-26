const Cart = require("../models/cart");
var awsConnect = require('./aws-connect')

// thêm sách vào shopping cart
exports.add_to_cart = function (req, res, next) {
  var sachID = req.params.id;
  //kiểm tra session ,khởi tạo Cart,
  var cart = new Cart(req.session.cart ? req.session.cart : {}); //really have or not
  
  var params = {
    TableName: "DA2Book",
    KeyConditionExpression: "#ma = :id",
    ExpressionAttributeNames: {
      "#ma": "_bookID"
    },
    ExpressionAttributeValues: {
      ":id": sachID
    }
  };
  
  awsConnect.docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (it) {
        cart.add(it, it._bookID);
      });
      req.session.cart = cart;
      //console.log(req.session.cart);
      res.json({
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

// thêm sách kèm số lượng
exports.add_to_cart2 = function (req, res, next) {
  var sachID = req.params.id;
  var soluong = Number(req.body.soluong);
  console.log(sachID + "_sl:" + soluong);
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var params = {
    TableName: "DA2Book",
    KeyConditionExpression: "#ma = :id",
    ExpressionAttributeNames: {
      "#ma": "_bookID"
    },
    ExpressionAttributeValues: {
      ":id": sachID
    }
  };
  awsConnect.docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (it) {
        cart.add2(it, it._bookID, soluong);
      });
      req.session.cart = cart;
      console.log(req.session.cart);
      
      res.json({
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty
      });
    }
  });
};

// show các sách ở trang cart
exports.get_items_cart = function (req, res, next) {
  if (!req.session.cart) {
    return res.render("user/pages/cart", {
      products: [],
      totalPrice: 0,
      totalQty: 0
    });
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray())
  res.render("user/pages/cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
};

// cập nhật số lượng
exports.update_cart = function (req, res, next) {
  if (!req.session.cart) {
    return res.render("user/pages/cart", {
      products: [],
      totalPrice: 0,
      totalQty: 0
    });
  }
  //var qty = req.body.qty;
  var cart = new Cart(req.session.cart);
  cart.generateArray().forEach(function (ct) {
    var nameqty = ct.item._bookID;
    var qtyItem = Number(req.body[nameqty]);
    cart.update(ct.item._bookID, qtyItem);
    req.session.cart = cart;
  });
  res.redirect("/cart");
};

// xoá sách với id
exports.delete_cart_item = function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.json({
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
};

// Nạp các sách trong cart vào trang checkout
exports.check_out = function (req, res, next) {
  if (!req.session.cart) {
    return res.render("user/pages/cart", {
      products: [],
      totalPrice: 0,
      totalQty: 0
    });
  }
  var cart = new Cart(req.session.cart);
  res.render("user/pages/checkout", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
};