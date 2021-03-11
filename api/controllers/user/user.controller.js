'use strict'

const SignUp = require('../../services/SignUp')
const helper = require('../../helpers')
const jwt = require('jsonwebtoken')

const UserController = () => {
  const signUp = async (req, res, next) => {
    try {
      const userParams = { email: req.body.email, password: req.body.password }
      const user = await new SignUp(userParams).signup()

      return helper.successResponse(req, res, user)
    } catch ( err ) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
  }

  const signUpPKI = async (req, res, next) => {
    try {
      const userParams = { username: req.body.username, orgName: req.body.orgName };

      const user = await new SignUp(userParams).signup()

      return helper.successResponse(req, res, user)
    } catch ( err ) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
  }

  return {
    signUp: signUp,
    signUpPKI, signUpPKI
  }
}

module.exports = UserController()