// import
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');

// init
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'sweetie cat',
  resave: false,
  saveUninitialized: true
}));

// route
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err.message);
  res.status(err.status || 500);
  var Cart = require("./models/cart");
  if (!req.session.cart) {
    return res.render('user/pages/404', {
      allBooks: [],
      products: [],
      totalPrice: 0,
      totalQty: 0
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('user/pages/404', {
    allBooks: [],
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
});

// locals category
app.locals.cats = require('./db/category/cat-data.json');

module.exports = app;