const { errorResponse } = require('../helpers')
const db = require('../models')

const apiAuth = async (req, res, next) => {
  let token = (req.headers['authorization'] || '').split(' ')
  if ( token.length < 2 ) {
    return errorResponse(req, res, 'Token is not provided', 401)
  }
  token = token[1].split('=')[1]

  if ( token == '' ) {
    return errorResponse(req, res, 'Token is invalid', 401)
  }

  try {
    const userToken = await db.UserToken.findOne({where: { token: token }, include: [db.User]})
    if ( userToken == null ) {
      return errorResponse(req, res, 'Incorrect token is provided, try re-login', 401)
    }
    req.currentUser = userToken.User

    return next()
  } catch ( error ) {

  }
}

module.exports = apiAuth