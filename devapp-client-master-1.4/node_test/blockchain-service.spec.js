'use strict';
const expect = require('chai').expect;
var async = require('async');
var BlockchainService = require('../server/common/blockchain-service');
var util = require('../server/util/util');
var service  = new BlockchainService();
var config = require("config");
var CONFIG =config.asset;
//test user name (already registered)
const USER_NAME = 'alice';

/* eslint-disable max-nested-callbacks */
describe('BlockchainService', () => {

  it('should register and enroll BlockchainService', (done) => {
    //register user
    service.register(USER_NAME, CONFIG.users[USER_NAME].secret)
    .then((rres) => {
      var secret = rres.result;
      console.log('success register. secret:' + secret);
      expect(secret).to.equal(CONFIG.users[USER_NAME].secret);
      //enroll user
      service.enroll(USER_NAME)
      .then((rrres) => {
        var user_enrollment = rrres.result;
        console.log('success user enroll:' + USER_NAME);
        expect(typeof USER_NAME).to.equal('string');
        done();
      });
    },(err) => {
      console.log('Failed if user has already registered: ' + err);
      done();
    });

  });

  it('should initialize and query BlockchainService', (done) => {
    service.query(USER_NAME,'query',['a'])
    .then((res) => {
      console.log('result:' + res.result);
      expect(typeof res.result).to.equal('string');
      done();
    },(err) => {
      console.log('Failed to query: ' + JSON.stringify(err));
    });
  });

  it('should initialize and invoke BlockchainService', (done) => {
    service.invoke(USER_NAME,'invoke',['a','b','10'])
    .then((res) => {
      console.log('result:' + res.result);
      expect(res.result).to.equal(true);
      done();
    },(err) => {
      console.log('Failed to invoke: ' + JSON.stringify(err));
    });
  });

  it('should initialize and invoke2 BlockchainService', (done) => {
    service.invoke(USER_NAME,'invoke',['b','a','10'])
    .then((res) => {
      console.log('result:' + res.result);
      expect(res.result).to.equal(true);
      done();
    },(err) => {
      console.log('Failed to invoke: ' + JSON.stringify(err));
    });
  });

  it('should install and instantiate chaincode', (done) => {
    const orgs = ['org1', 'org2'];
    let ver = String((new Date).getTime());
    //install is invoked per org by peerAdmin.
    //do not use CONFIG.chaincode.id for new instantiation or set upgrade true.
    async.each(orgs, (org, next) => {
      service.install(org, CONFIG.chaincode.id, CONFIG.chaincode.path, ver, '')
      .then((res) => {
        console.log('install result:' + res.result);
        expect(res.result).to.equal(true);
        next();
      },(err) => {
        console.log('Failed to install: ' + JSON.stringify(err) + ' ver:' + ver);
      });
    }, (err) => {
      if( err ) {
        console.log('failed to process' + err);
      } else {
        console.log('install have been processed successfully');
        service.instantiate(orgs[0], true, CONFIG.chaincode.id, ver,
          'init', ["a","100","b","200"])
        .then((res) => {
          console.log('instantiate result:' + res.result);
          expect(res.result).to.equal(true);
          done();
        },(err) => {
          console.log('Failed to instantiate: ' + JSON.stringify(err) + ' ver:' + ver);
        });
      }
    });
  });

});
/* eslint-enable max-nested-callbacks */
