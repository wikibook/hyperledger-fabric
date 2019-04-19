/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// This is an end-to-end test that focuses on exercising all parts of the fabric APIs
// in a happy-path scenario
'use strict';
let BlockchainService = require('../server/common/blockchain-service');
let service  = new BlockchainService();
let config = require("config");
// let async = require('async');
let CONFIG =config.asset;

let utils = require('fabric-client/lib/utils.js');
let logger = utils.getLogger('install-chaincode');
const ver = '3.0';

function install(version) {

  service.install('org1', CONFIG.chaincode.id, CONFIG.chaincode.path,  version, 'golang', true)
		.then(() => {
			logger.info('Successfully installed chaincode in peers of organization "org1"');
			return service.install('org2', CONFIG.chaincode.id, CONFIG.chaincode.path,  version, 'golang', true);
		}, (err) => {
			logger.error('Failed to install chaincode in peers of organization "org1". '+JSON.stringify(err));
			return service.install('org2', CONFIG.chaincode.id, CONFIG.chaincode.path,  version, 'golang', true);
		}).then(() => {
			logger.info('Successfully installed chaincode in peers of organization "org2"');
			return service.install('org3', CONFIG.chaincode.id, CONFIG.chaincode.path,  version, 'golang', true);
		}, (err) => {
			logger.error('Failed to install chaincode in peers of organization "org2". '+JSON.stringify(err));
			return service.install('org3', CONFIG.chaincode.id, CONFIG.chaincode.path,  version, 'golang', true);
		}).then(() => {
			logger.info('Successfully installed chaincode in peers of organization "org3"');
		}, (err) => {
			logger.error('Failed to install chaincode in peers of organization "org3". '+JSON.stringify(err));
		});
}

install(ver);
