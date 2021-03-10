var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const walletsRouter = require('./routes/wallets');
const sessionsRouter = require('./routes/sessions');
const apiAuthMiddleware = require('./middleware/apiAuth')
const errorHandler = require('./middleware/errorHandler')

require('./models/index')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/wallets', apiAuthMiddleware, walletsRouter);
app.use(errorHandler)

module.exports = app;
