'use strict'
const Login = require('../../services/Login')
const helpers = require('../../helpers')

const SessionController = () => {
  const login = async (req, res, next) => {
    try {
      const loginParams = { email: req.body.email, password: req.body.password }

      const result = await new Login(loginParams, req.app.get('secret')).login()

      return helpers.successResponse(req, res, result, 200)

    } catch ( err ) {
      return helpers.errorResponse(req, res, [err.message], 400, err)
    }
  }

  return {
    login: login
  }
}

module.exports = SessionController()