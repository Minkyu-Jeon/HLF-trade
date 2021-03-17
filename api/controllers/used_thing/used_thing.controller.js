'use strict'

const { Wallets, Gateway } = require('fabric-network')
const path = require('path')
const helper = require('../../helpers')
const { buildCCPOrg, buildWallet } = require('../../utils/AppUtil')
const channelName = 'mychannel'
const chainCodeName = 'used_thing_cc'

const UsedThingController = () => {

  const destroy = async (req, res, next) => {
    let result
    try {
      const ccp = buildCCPOrg(['../', 'config', 'connection-org1.json'])

      const walletPath = path.join(process.cwd(), 'wallets')
      
      const wallet = await buildWallet(Wallets, walletPath)

      const gateway = new Gateway()

      try {
        await gateway.connect(ccp, {
          wallet: wallet,
          identity: req.user.email,
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(channelName)

        const contract = network.getContract(chainCodeName)
        
        result = await contract.submitTransaction('DeleteAsset', req.params.id)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
      } catch (err) {
        throw new Error(err.message)
      }
       finally {
        gateway.disconnect()
      }
    } catch (err) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
    return helper.successResponse(req, res, result, 0)
  }

  const update = async (req, res, next) => {
    let result
    try {
      const ccp = buildCCPOrg(['../', 'config', 'connection-org1.json'])

      const walletPath = path.join(process.cwd(), 'wallets')
      
      const wallet = await buildWallet(Wallets, walletPath)

      const gateway = new Gateway()

      try {
        await gateway.connect(ccp, {
          wallet: wallet,
          identity: req.user.email,
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(channelName)

        const contract = network.getContract(chainCodeName)
        
        const createAssetParams = [req.params.id, req.body.color, req.body.size, req.body.owner, req.body.appraisedValue]

        result = await contract.submitTransaction('UpdateAsset', ...createAssetParams)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
      } catch (err) {
        throw new Error(err.message)
      }
       finally {
        gateway.disconnect()
      }
    } catch (err) {
      return helper.errorResponse(req, res, [err.message], 400, err)
    }
    return helper.successResponse(req, res, result, 0)
  }

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
          identity: req.user.email,
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(channelName)

        const contract = network.getContract(chainCodeName)

        result = await contract.evaluateTransaction('ReadAsset', req.params.id)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
      } catch (err) {
        throw new Error(err.message)
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
          identity: req.user.email,
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(channelName)

        const contract = network.getContract(chainCodeName)

        result = await contract.evaluateTransaction('GetAllAssets')
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
      } catch (err) {
        throw err
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
          identity: req.user.email,
          discovery: { enabled: true, asLocalhost: false }
        })

        const network = await gateway.getNetwork(channelName)

        const contract = network.getContract(chainCodeName)

        const createAssetParams = [
          req.body.id, 
          req.body.category, 
          req.body.title, 
          req.body.product_name, 
          req.body.image_url,
          req.body.description,
          req.body.price,
          req.user.email
        ]

        result = await contract.submitTransaction('CreateAsset', ...createAssetParams)
        console.log('*** Result: committed')
        if ( `${result}` !== '' ) {
          console.log(`*** Result: ${result.toString()}`)
        }
        result = JSON.parse(result.toString())
      } catch (err) {
        throw err
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
    show: show,
    update: update,
    destroy: destroy,
  }
}

module.exports = UsedThingController()