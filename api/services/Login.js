const db = require('../models')
const helper = require('../helpers')
const AppUtil = require('../utils/AppUtil')
const { Wallets } = require('fabric-network');
const path = require('path')

class Login {
  constructor(loginParams, secret) {
    this.loginParams = loginParams
    this.secret = secret
  }

  async login() {
    const user = await db.User.scope('withSecretColumns').
      findOne({ where: { email: this.loginParams.email } })

    if ( !user ) {
      throw new Error('Please check your email')
    }

    if ( !user.comparePassword(this.loginParams.password) ) {
      throw new Error('Please check your password')
    }
    const walletPath = path.join(process.cwd(), 'wallets')
    const wallet = await AppUtil.buildWallet(Wallets, walletPath)
    const userIdentity = await wallet.get(this.loginParams.email)

    let orgName
    if ( userIdentity ) {
      orgName = userIdentity.mspId
    }

    const token = helper.issueToken(user.id, this.loginParams.email, orgName, this.secret)

    const userData = Object.assign(user.toJSON(), ({token: token}))

    return { user: this.serializeResult(userData), token: token }
  }

  serializeResult(data) {
    return {
      id: data.id,
      email: data.email,
    }
  }
}

module.exports = Login;