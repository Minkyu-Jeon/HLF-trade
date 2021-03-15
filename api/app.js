'use strict'

const express = require('express');
const path = require('path');
const bearerToken = require('express-bearer-token')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
const assetsRouter = require('./routes/assets');
const errorHandler = require('./middleware/errorHandler');
const { errorResponse } = require('./helpers');

require('./models/index')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const skipAuthPaths = ['/users', '/sessions']
// set secret constiable
app.set('secret', process.env.EXPRESS_SECRET_KEY_BASE)
// app.use(expressJWT({
//   secret: process.env.EXPRESS_SECRET_KEY_BASE,
//   algorithms: ['HS256']
// }).unless({
//   path: skipAuthPaths
// }))
app.use(bearerToken())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  if ( skipAuthPaths.includes(req.originalUrl) ) {
    return next()
  }
  const token = req.token
  let result = true
  let error;

  jwt.verify(token, app.get('secret'), (err, decoded) => {
    if ( err ) {
      result = false
      error = err
      console.log(`Error ===================: ${err}`)
      return 
    }

    req.username = decoded.username;
    req.orgname = decoded.orgName;
  })

  if ( ! result ) {
    errorResponse(req, res, error.name, 200)
  }

  return next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/assets', assetsRouter);
app.use(errorHandler)

module.exports = app;
