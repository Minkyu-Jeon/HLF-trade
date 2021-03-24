const Joi = require('joi')

const register = {
  body: {
    serial_number: Joi.string().required(),
    category: Joi.string().required(),
    title: Joi.string().required(),
    product_name: Joi.string().required(),
    price: Joi.number().integer().required(),
  }
}

module.exports = {
  register: register
}