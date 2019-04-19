/**
 *  route index
 */

const express = require('express');
const router = express.Router();
const path = require('path');

var BlockchainService = require('../common/blockchain-service');
var service = new BlockchainService();
var utils = require('fabric-client/lib/utils.js');
var logger = utils.getLogger('index');

let util = require('../util/util');

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
});

/**
 * get loggined user info
 */
router.get('/api/user', (req, res) => {
  res.json(util.getUser(req));
});

/**
 * do logout
 */
router.delete('/api/user', (req, res) => {
  //for Basic-Auth logout
  res.status(401).json({"message":"logout success"});
});

/**
 * fetch car list from fabric
 */
router.get('/api/car', (req, res) => {
  service.query(util.getUser(req).id,'ListCars',[])
  .then((resp) => {
    res.json(JSON.parse(resp.result));
  });
});

/**
 * add car on fabric
 */
router.post('/api/car', (req, res) => {
  let car = req.body;
  service.invoke(util.getUser(req).id,'AddCar',[JSON.stringify(car)],false)
  .then((resp) => {
    res.json(resp);
  },(err) => {
    logger.error('Failed to invoke: ' + JSON.stringify(err));
    res.status(500).json(err);
  });
});

/**
 * transfer car on fabric
 */
router.put('/api/car', (req, res) => {
  const DOUBLE_QUOTE = '"';
  let car = req.body;
  service.invoke(util.getUser(req).id,'TransferCar',[DOUBLE_QUOTE + car.Id + DOUBLE_QUOTE,
    DOUBLE_QUOTE + car.OwnerId + DOUBLE_QUOTE],false)
  .then((resp) => {
    res.json(resp);
  },(err) => {
    logger.error('Failed to invoke: ' + JSON.stringify(err));
    res.status(500).json(err);
  });
});

module.exports = router;
