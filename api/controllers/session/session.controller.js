'use strict'
const Login = require('../../services/Login')
const db = require('../../models')
const helpers = require('../../helpers')

const SessionController = () => {
  const login = async (req, res, next) => {
    try {
      const loginParams = { email: req.body.email, password: req.body.password }
      
      const result = await new Login(loginParams, req.app.get('secret')).login()

      res.cookie('x_auth', result.token)

      return helpers.successResponse(req, res, result, 200)

    } catch ( err ) {
      return helpers.errorResponse(req, res, [err.message], 400, err)
    }
  }

  const info = async(req, res, next) => {
    const user = await db.User.findOne({ where: { id: req.user.id } })

    const token = helpers.issueToken(
      req.user.id, 
      req.user.email, 
      req.user.userTokenString, 
      req.user.orgName, 
      req.app.get('secret')
    )

    res.cookie('x_auth', token)

    const result = {
      user: user,
      token: token
    }

    return helpers.successResponse(req, res, result, 200)
  }

  const logout = async(req, res, next) => {
    await db.UserToken.destroy({
      where: {
        user_id: req.user.id
      }
    })

    return helpers.successResponse(req, res, true, 200)
  }

  return {
    login: login,
    info: info,
    logout: logout
  }
}

module.exports = SessionController()