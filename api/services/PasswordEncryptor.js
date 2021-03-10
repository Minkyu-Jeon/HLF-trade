const bcrypt = require('bcrypt')
const saltRounds = 10

class PasswordEncryptor {
  encrypt(str) {
    const encryptedData = bcrypt.hashSync(str, saltRounds)
    return encryptedData
  }

  compare(str, hash) {
    const result = bcrypt.compareSync(str, hash)
    return result
  }
}

module.exports = PasswordEncryptor