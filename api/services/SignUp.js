// const db = require('../models')
const FabricCAServices = require('fabric-ca-client');
const AppUtil = require('../utils/AppUtil')
const CAUtil = require('../utils/CAUtil')
const { Wallets } = require('fabric-network');
const path = require('path')

class SignUp {
  constructor(userParams) {
    this.userParams = userParams
  }

  // async signup() {
  //   const user = await db.User.findOne({ where: { email: this.userParams.email } })

  //   if ( user ) {
  //     throw new Error('User already exists with the same email')
  //   }

  //   const newUser = await db.User.create(this.userParams)
  //   return { user: newUser.toJSON(), result: true }
  // }

  getAffiliation(org) {
    return org == 'Org1' ? 'org1.department1' : 'org2.department1'
  }

  async signup() {
    const ccp = AppUtil.buildCCPOrg(['../', 'config', 'connection-org1.json'])
    
    const caClient = CAUtil.buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com')

    const wallet = await AppUtil.buildWallet(Wallets, path.join(process.cwd(), 'wallets'))

    await CAUtil.registerAndEnrollUser(caClient, wallet, this.userParams.orgName, this.userParams.username, this.getAffiliation(this.userParams.orgName))

    return this.userParams
  }
}

module.exports = SignUp;