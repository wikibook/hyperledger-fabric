/**
 * Fabric client wrapper
 */
var CONFIG = require("config");

var BlockchainService = require('./bc/blockchain-service-' + CONFIG['ver']);
module.exports = BlockchainService;
