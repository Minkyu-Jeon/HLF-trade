const FabricCAServices = require('fabric-ca-client');
const AppUtil = require('../utils/AppUtil')
const CAUtil = require('../utils/CAUtil')
const { Wallets } = require('fabric-network');
const path = require('path')


class EnrollUser {
  constructor(userParams, orgName) {
    this.userParams = userParams
    this.orgName = orgName
  }

  getAffiliation() {
    return `${this.lowerCaseOrgName()}.department1`
  }

  async enroll() {
    const ccp = AppUtil.buildCCPOrg(['../', 'config', `connection-${this.lowerCaseOrgName()}.json`])
    
    const caClient = CAUtil.buildCAClient(FabricCAServices, ccp, `ca.${this.lowerCaseOrgName()}.example.com`)

    const wallet = await AppUtil.buildWallet(Wallets, path.join(process.cwd(), 'wallets'))

    if ( await wallet.get(this.userParams.email) ) {
      return this.userParams
    }

    await CAUtil.registerAndEnrollUser(caClient, wallet, this.orgName, this.userParams.email, this.getAffiliation())

    return this.userParams
  }

  lowerCaseOrgName() {
    return this.orgName.toLowerCase()
  }

}

module.exports = EnrollUser;