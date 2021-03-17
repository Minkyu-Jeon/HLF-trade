// const db = require('../models')
const FabricCAServices = require('fabric-ca-client');
const AppUtil = require('../utils/AppUtil')
const CAUtil = require('../utils/CAUtil')
const { Wallets } = require('fabric-network');
const path = require('path')


class EnrollUser {
  constructor(userParams) {
    this.userParams = userParams
  }

  getAffiliation(org) {
    return org == 'Org1' ? 'org1.department1' : 'org2.department1'
  }

  async enroll() {
    const ccp = AppUtil.buildCCPOrg(['../', 'config', 'connection-org1.json'])
    
    const caClient = CAUtil.buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com')

    const wallet = await AppUtil.buildWallet(Wallets, path.join(process.cwd(), 'wallets'))

    await CAUtil.registerAndEnrollUser(caClient, wallet, this.userParams.orgName, this.userParams.username, this.getAffiliation(this.userParams.orgName))

    return this.userParams
  }
}

module.exports = EnrollUser;