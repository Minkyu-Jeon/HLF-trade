'use strict'

const { successResponse } = require('../../helpers')

const WalletController = () => {
  const create = async (req, res, next) => {
    return successResponse(req, res, {})
  }

  return {
    create: create
  }
}

module.exports = WalletController()