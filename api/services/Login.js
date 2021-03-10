const db = require('../models')
const { v4: uuidv4 } = require('uuid')

class Login {
  constructor(loginParams) {
    this.loginParams = loginParams
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

    // find user_token and if it exsits, then destroy it
    const userToken = await db.UserToken.findOne({ where: { user_id: user.id } })

    if ( userToken ) {
      db.UserToken.destroy({ where: { user_id: userToken.user_id } })
    }

    let token = null
    do {
      token = uuidv4()
    } while ( !db.UserToken.findOne({ where: { token: token } }) )
    
    const newUserToken = await db.UserToken.create({user_id: user.id, token: token})

    const userData = Object.assign(user.toJSON(), ({userToken: newUserToken.toJSON()}))

    return { user: this.serializeResult(userData) }
  }

  serializeResult(data) {
    return {
      id: data.id,
      email: data.email,
      userToken: {
        token: data.userToken.token
      }
    }
  }
}

module.exports = Login;