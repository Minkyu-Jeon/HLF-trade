const Joi = require('joi')

const signUp = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }
}

const signUpPKI = {
  body: {
    username: Joi.string().required(),
    orgName: Joi.string().required()
  }
}

module.exports = {
  signUp: signUp,
  signUpPKI, signUpPKI
}