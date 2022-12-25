/**
 * thư viện cần thiết
 */
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const hbs = require("hbs");
var fs = require("fs");
var flash = require("connect-flash");
// require("dotenv").config();
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env"
  })
}
const session = require("express-session");
const mongoose = require("mongoose");
require("./components/users/model");
require("./components/cart/model");
require("./components/products/model");
require("./components/order-detail/model");
require("./components/category/model");

/**
 * khởi tạo app
 */
var app = express();

// view engine setup
hbs.registerPartial(
  "sidebar",
  fs.readFileSync(
    path.join(__dirname, "views", "/partials/_sidebar.hbs"),
    "utf8"
  )
);
hbs.registerPartial(
  "navbar",
  fs.readFileSync(
    path.join(__dirname, "views", "/partials/_navbar.hbs"),
    "utf8"
  )
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
mongoose
  .connect(process.env.MONGOOSE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));
app.use(cors({ origin: true, credentials: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * HBS
 */
//  hbs.registerHelper('soThuTu', function (a,b) {
//   return (a + 1);
// });

// hbs.registerHelper('formatDate', function (a, type, b) {
//   let date = new Date(a);
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();
//   month = month.toString().length === 1 ? '0' + month : month;
//   let day = date.getDate().toString().length === 1 ?
//      '0' + date.getDate().toString() : date.getDate().toString();
//   if (type == 1) {
//     return day + '-' + month + '-' + year;
//   }
//   return year + '-' + month + '-' + day;
// });

// hbs.registerHelper('getCategoryName', function (id, categories,b) {
//   const category = categories.filter(c => c._id.toString() === id.toString())[0];
//   return category.name;
// });

// hbs.registerHelper('compareCategory', function (_id, id, b) {
//   return _id.toString() === id.toString();
// });


/**
 * Routing, định tuyến
 * http://localhost:3000/
 */
var apiCategory = require('./routes/apiCategory');
var apiProduct = require('./routes/apiProduct');
var apiUser = require('./routes/apiUser');
var apiCart = require('./routes/apiCart');
var apiOrder = require('./routes/apiOrder');
var apiComment = require('./routes/apiComment');
var apiFavorite = require('./routes/apiFavorite');
var order = require('./routes/order');
var products = require('./routes/product');
var user = require('./routes/user');
var statistical = require('./routes/statistical');
var category = require('./routes/category');
var profile = require('./routes/profile');
var addCart = require('./routes/cart');
var discount = require('./routes/discount');
var apiPayment = require('./routes/apiPayment');
var apiAddress = require('./routes/apiAddress');

app.use('/api/cart', apiCart);
app.use('/api/address', apiAddress);
app.use('/api/categories', apiCategory);
app.use('/api/products', apiProduct);
app.use('/api/user', apiUser);
app.use('/api/order', apiOrder);
app.use('/api/comment', apiComment);
app.use('/api/payment', apiPayment);
app.use('/api/favorite', apiFavorite);
app.use('/', discount);
app.use('/', addCart);
app.use('/', order);
app.use('/', statistical);
app.use('/', products);
app.use('/', profile);
app.use('/', user);
app.use('/', category);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;