/*
 * Fabric Client Sample User Registration Script
 */

'use strict';
let BlockchainService = require('../server/common/blockchain-service');
let util = require('../server/util/util');
let service  = new BlockchainService();
let config = require("config");
let async = require('async');
let CONFIG =config.asset;
let installpromises = [];
let instapromises = [];

// target organizations for deploy.
// setup /config/default.json asset.chaincode property.
const orgs = ['org1', 'org2', 'org3'];
// set true if same chaincode is already deployed.
const update = false;
// init function setting
const initFnc = 'init';
// fabcar
const initArgs = [];
// example_chaincode2
//const initArgs = ["a","100","b","200"];
const ver = String((new Date).getTime());
let cnt=0;

function deploy(ver, orgs, update, initFnc, initArgs) {
  //install is invoked per org by peerAdmin.
  //do not use CONFIG.chaincode.id for new instantiation or set upgrade true.
  async.each(orgs, (org, next) => {
    console.log("service.install org:"+org+" chaincode.id:"+CONFIG.chaincode.id+" CONFIG.chaincode.path:"+CONFIG.chaincode.path+" ver:"+ver);
    let installprom = service.install(org, CONFIG.chaincode.id, CONFIG.chaincode.path, ver, 'golang',true)
      .then((res) => {
        console.log('install result:' + res.result);
        next();
      },(err) => {
        console.log('Failed to install: ' + JSON.stringify(err) + ' ver:' + ver);
      });
    installpromises.push(installprom);
  }, (err) => {
    if( err ) {
      console.log('failed to process' + err);
    } else {
      console.log('install have been processed successfully');
      let instantprom = service.instantiate('org1', update, CONFIG.chaincode.id, ver, initFnc, initArgs , true)
        .then((res) => {
          cnt++;
          console.log('instantiate result:' + res.result);
        },(err) => {
          cnt++;
          console.log('Failed to instantiate: ' + JSON.stringify(err) + ' ver:' + ver);
        });
      instapromises.push(instantprom);
    }
  });
}

deploy(ver, orgs, update, initFnc, initArgs);
Promise.all(installpromises).then(function(values) {
  Promise.all(instapromises).then(function(values) {
    process.exit(0);
  });
});
