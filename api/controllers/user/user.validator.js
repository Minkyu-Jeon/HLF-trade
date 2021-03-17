const Joi = require('joi')

const signUp = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    nickname: Joi.string().required(),
    address: Joi.string().required(),
  }
}

module.exports = {
  signUp
}