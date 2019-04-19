#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

#docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb

export IMAGE_TAG=1.4.0

docker-compose -f docker-compose.yml up -d cli orderer.example.com \
               ca.org1.example.com peer0.org1.example.com \
               ca.org2.example.com peer0.org2.example.com \
               ca.org3.example.com peer0.org3.example.com

## wait for Hyperledger Fabric to start
## incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
##echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx  --tls --cafile /etc/hyperledger/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Join peer0.org1.example.com to the channel.
docker exec peer0.org1.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
docker exec peer0.org2.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
docker exec peer0.org3.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block

