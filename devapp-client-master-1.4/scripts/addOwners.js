/*
 * invoke addOwner for cartransfer
 */

 'use strict';
 let BlockchainService = require('../server/common/blockchain-service');
 let service = new BlockchainService();
 let config = require("config");
 let CONFIG =config.asset;
 let invoker = 'admin';
 let promises = [];

 function addOwner(user) {
   //add Owner
   let prom = service.invoke(invoker,  'AddOwner', [JSON.stringify(user)],true)

   .then((resp) => {
     console.log('success add owner:' + JSON.stringify(user));
   },(err) => {
     console.log('Failed to invoke: ' + JSON.stringify(err.message)+"  "+JSON.stringify(user));
   });
   promises.push(prom);
 }


// addOwner({'Id':'bob'});

 for(let user in CONFIG.users) {
   addOwner({'Id':user});
 }


 Promise.all(promises).then(function(values) {
  process.exit(0);
 });
