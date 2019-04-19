/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// This is an end-to-end test that focuses on exercising all parts of the fabric APIs
// in a happy-path scenario
'use strict';
let BlockchainService = require('../server/common/blockchain-service');
let config = require("config");
let CONFIG =config.asset;

var utils = require('fabric-client/lib/utils.js');
var logger = utils.getLogger('instantiate-chaincode');
logger.level = 'debug';

const ver = '1.0';


function instantiate(version) {

  BlockchainService.instantiateChaincode('org1', CONFIG.chaincode.id, CONFIG.chaincode.path, version, 'golang', false, false)
		.then((result) => {
			if(result){
				logger.info('Successfully instantiated chaincode on the channel');

				return BlockchainService.sleep(5000);
			}
			else {
				logger.error('Failed to instantiate chaincode ');
			}
		}, (err) => {
			logger.error('Failed to instantiate chaincode on the channel. ' + err.stack ? err.stack : err);
		}).then(() => {
			logger.info('Successfully slept 5s to wait for chaincode instantiate to be completed and committed in all peers');
		});
}

instantiate(ver);
