/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const AppUtil = require('./utils/AppUtil')
const CAUtil = require('./utils/CAUtil')
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccp = AppUtil.buildCCPOrg(['../', 'config', 'connection-org1.json'])
        const caClient = CAUtil.buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com')

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallets');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        await CAUtil.enrollAdmin(caClient, wallet, 'Org1MSP')

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
