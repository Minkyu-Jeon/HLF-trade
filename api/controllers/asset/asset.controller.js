'use strict'

const { Wallets, Gateway } = require('fabric-network')
const path = require('path')
const helper = require('../../helpers')
const { buildCCPOrg, buildWallet } = require('../../utils/AppUtil')

const AssetController = () => {
  const register = async (req, res, next) => {
    let result

    try {
      const ccp = buildCCPOrg(['../', 'config', 'connection-org1.json'])

      const walletPath = path.join(process.cwd(), 'wallets')
      
      const wallet = await buildWallet(Wallets, walletPath)

      const gateway = new Gateway()

      try {
        await gateway.connect(ccp, {
          wallet: wallet,
          identity: req.username,
          discovery: { enabled: true, asLocalhost: true }
        })

        console.log(req.body.channelName)
        const network = await gateway.getNetwork(req.body.channelName)

        const contract = network.getContract(req.body.chaincodeName)

        const createAssetParams = [req.body.id, req.body.color, req.body.size, req.body.owner, req.body.apprisedValue]

        result = await contract.evaluateTransaction('CreateAsset', ...createAssetParams)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
      } catch (err) {
        console.log(err)
      }
       finally {
        gateway.disconnect()
      }
    } catch (err) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }

    return helper.successResponse(req, res, result, 0)
  }

  return {
    register: register
  }
}

module.exports = AssetController()