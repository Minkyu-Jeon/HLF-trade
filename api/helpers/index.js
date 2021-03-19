const jwt = require('jsonwebtoken')
const successResponse = (req, res, data, code = 200) => res.send({
  code,
  data,
  success: true,
})

const errorResponse = (
  req,
  res,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {},
) => res.status(code).json({
  code,
  errorMessage,
  error,
  data: null,
  success: false
})

const issueToken = (id, email, orgName, secret) => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRATION),
    id: email,
    email: email,
    orgName: orgName
  }, secret)
}

module.exports = {
  successResponse: successResponse,
  errorResponse: errorResponse,
  issueToken: issueToken,
}