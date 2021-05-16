
'use strict'

const { Wallets, Gateway } = require('fabric-network')
const path = require('path')
const { buildCCPOrg, buildWallet } = require('./utils/AppUtil')
const channelName = 'mychannel'
const chainCodeName = 'used_thing_cc'

const selling = async (req) => {
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

      const params = ["0123", "asdf-0123"]
      result = await contract.submitTransaction('DislikeAsset', ...params)
      if ( `${result}` !== '' ) {
        console.log(`*** Result: success`)
      }
      result = JSON.parse(result.toString())
    } catch (err) {
      throw err
    }
      finally {
      gateway.disconnect()
    }
  } catch (err) {
    console.log("error: " + err)
  }
  console.log("success: " + JSON.stringify(result))
}


selling({user: { email: "user3@example.com" }})