const Joi = require('joi')

const register = {
  body: {
    chainCodeName: Joi.string().required(),
    channelName: Joi.string().required(),
    id: Joi.string().required(),
    color: Joi.string().required(),
    size: Joi.number().integer().required(),
    owner: Joi.string().required(),
    appraisedValue: Joi.number().integer().required(),
  }
}

module.exports = {
  register: register
}