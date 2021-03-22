const db = require('../models')
const helper = require('../helpers')
const AppUtil = require('../utils/AppUtil')
const { Wallets } = require('fabric-network');
const path = require('path')
const crypto = require('crypto')

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

    let userTokenString;
    do {
      userTokenString = crypto.randomBytes(64).toString('hex')
    } while ( await db.UserToken.findOne({ where: { token: userTokenString } }) !== null )

    let userToken = await db.UserToken.findOne({ where: { user_id: user.id } })
    if ( userToken === null ) {
      userToken = db.UserToken.build({ user_id: user.id })
    }
    userToken.token = userTokenString
    await userToken.save()

    const JWTtoken = helper.issueToken(user.id, this.loginParams.email, userTokenString, orgName, this.secret)

    const userData = Object.assign(user.toJSON(), ({token: JWTtoken}))

    return { user: this.serializeResult(userData), token: JWTtoken }
  }

  serializeResult(data) {
    return {
      id: data.id,
      email: data.email,
    }
  }
}

module.exports = Login;