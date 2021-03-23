'use strict'

const SignUp = require('../../services/SignUp')
const EnrollUser = require('../../services/EnrollUser')
const helper = require('../../helpers')

const UserController = () => {
  const signUp = async (req, res, next) => {
    try {
      const userParams = {
        email: req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
        phone: req.body.phone,
        address: req.body.address
      };
      
      const user = await new SignUp(userParams).signup()

      return helper.successResponse(req, res, user)
    } catch ( err ) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
  }

  const enroll = async (req, res, next) => {
    try {
      const mspId = await new EnrollUser(req.user, req.body.orgName).enroll()

      const token = helper.issueToken(
        req.user.id, 
        req.user.email, 
        req.user.userTokenString, 
        mspId, 
        req.app.get('secret')
      )

      res.cookie('x_auth', token)

      return helper.successResponse(req, res, { orgName: mspId })
    } catch ( err ) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
  }

  return {
    signUp: signUp,
    enroll: enroll
  }
}

module.exports = UserController()