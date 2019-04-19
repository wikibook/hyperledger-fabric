/**
 * Fabric client stub
 */
const queryData = require("./mock/query.json");

var BlockchainService = function() {
  var vm = this;

  vm.query = function(enrollId, fnc, args) { //eslint-disable-line no-unused-vars
    var data = {};
    data = queryData[fnc];
    return new Promise(function(resolve){
      resolve({"result":JSON.stringify(data)});
    });
  };

  vm.invoke = function(enrollId, fnc, args) { //eslint-disable-line no-unused-vars
    return new Promise(function(resolve){
      resolve({"result":true});
    });
  };

  vm.enroll = function(enrollId, enrollsecret) { //eslint-disable-line no-unused-vars
    return new Promise(function(resolve){
      resolve({"result":"User successfully logged in: " + enrollId});
    });
  };

}

module.exports = BlockchainService;
