var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwtExpress = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var res_http = 'http://localhost:8080';
var app = express();

var corsOptions = {
  origin: res_http,//允许跨域域名
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(jwtExpress({ secret: 'user'}).unless({
//   path: [
//     '/login',
//     '/register'
//   ]
// }));

app.use('/', usersRouter);

module.exports = app;
