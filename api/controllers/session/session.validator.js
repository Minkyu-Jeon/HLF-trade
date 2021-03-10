const Joi = require('joi')

const login = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
}

module.exports = {
  login: login
}