/*
 * Fabric Client Sample User Registration Script
 */

'use strict';
let BlockchainService = require('../server/common/blockchain-service');
let service = new BlockchainService();
let config = require("config");
let ASSET =config.asset;
let USERS = config.users;
let promises = [];

function registerUser(username) {
  //register user
  let regprom = service.register(username, ASSET.users[username].secret)
    .then((rres) => {

      console.log('success register.' + rres);

    },(err) => {
      console.log('Failed  user : ' + JSON.stringify(err.stack ? err.stack : err.message));
    });
  promises.push(regprom);
}


// registerUser('alice');
// registerUser('bob');
// registerUser('charlie');
// registerUser('admin');
var lenUser =0;
for(let user in USERS) {
    lenUser++;
    console.log('registerUser-'+'user:'+user+" cnt:"+lenUser)
    registerUser(user);
}
Promise.all(promises).then(function(values) {
  console.log("Promise.all cnt:"+lenUser);
  process.exit(0);
});
