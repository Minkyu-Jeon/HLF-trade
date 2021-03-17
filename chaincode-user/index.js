'use strict';

const UserChainCode = require('./lib/UserChainCode.js');

module.exports.UserChainCode = UserChainCode;
module.exports.contracts = [UserChainCode];
