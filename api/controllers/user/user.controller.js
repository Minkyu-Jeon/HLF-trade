'use strict'

const SignUp = require('../../services/SignUp')
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

  return {
    signUp: signUp
  }
}

module.exports = UserController()