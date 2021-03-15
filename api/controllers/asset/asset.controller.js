'use strict'

const { Wallets, Gateway } = require('fabric-network')
const path = require('path')
const helper = require('../../helpers')
const { buildCCPOrg, buildWallet } = require('../../utils/AppUtil')

const AssetController = () => {
  const show = async (req, res, next) => {
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
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(req.params.channelName)

        const contract = network.getContract(req.params.chainCodeName)

        result = await contract.evaluateTransaction('ReadAsset', req.params.id)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
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

  const index = async (req, res, next) => {
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
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(req.params.channelName)

        const contract = network.getContract(req.params.chainCodeName)

        result = await contract.evaluateTransaction('GetAllAssets')
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
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
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(req.body.channelName)

        const contract = network.getContract(req.body.chainCodeName)

        const createAssetParams = [req.body.id, req.body.color, req.body.size, req.body.owner, req.body.appraisedValue]

        result = await contract.submitTransaction('CreateAsset', ...createAssetParams)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
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
    register: register,
    index: index,
    show: show
  }
}

module.exports = AssetController()