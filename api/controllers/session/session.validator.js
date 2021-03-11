const Joi = require('joi')

const login = {
  body: {
    username: Joi.string().required(),
    orgName: Joi.string().required()
  }
}

module.exports = {
  login: login
}