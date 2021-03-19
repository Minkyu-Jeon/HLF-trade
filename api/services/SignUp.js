const db = require('../models')

class SignUp {
  constructor(userParams) {
    this.userParams = userParams
  }

  async signup() {
    const user = await db.User.findOne({ where: { email: this.userParams.email } })

    if ( user ) {
      throw new Error('User already exists with the same email')
    }

    const newUser = await db.User.create(this.userParams)
    return { user: newUser.toJSON() }
  }
}

module.exports = SignUp;