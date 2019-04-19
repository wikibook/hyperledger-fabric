# Fabric Client Sample Application

## Requirement

### Hyperledger Fabric version
v1.0.6

### Browser / ブラウザ
we tested this webapp with Chrome v65.0.3325.181 and Firefox v52.7.2.

このアプリケーションはChrome v65.0.3325.181とFirefox v52.7.2で動作確認しています。

### Application modules and development / 依存モジュール
see /package.json

/package.jsonで依存モジュールをご確認ください。

## Install / インストール
`npm install` on application root

アプリのルートディレクトリで`npm install`してください。

## Fabric setup
you need to set up your fabric Environment first.
and install and instantiate CarTransfer chaincode.
then setup application config for Peers, Orderers, CAs, MSP users and cert pathes info on /config/default.json .

アプリの利用には接続先のFabric環境をセットアップする必要があります。
そのうえでチェーンコードのインストールとインスタンス化を行ってください。接続先アプリケーションは書籍で提供するcartransferチェーンコードとなります。
また、設定ファイル(/config/default.json)にPeers, Orderers, CAs, MSPユーザーや証明書のパスを設定します。

```
"asset": {
  //admin user for channel setup
  "adminUser":"admin",
  "users":{
    //all enrollments on MSP
    "admin":{
       "secret":"adminpw",
       "org":"org1"
    }
  },
  //your key-val store path for ECerts
  "keyValueStore":"./fabric-client-kvs",
  //your TLS certs Root directory
  "cert_dir": "/home/vagrant/git/fabric-samples/first-network/",
  //channel setting
  "channel":{
    "name": "mychannel"
  },
  //chaincode setting
  "chaincode":{
    "id" : "mycc",
    "path" : "github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02",
    "endorsement" : {
      "identities": [
        { "role": { "name": "member", "mspId": "org1" }},
        { "role": { "name": "member", "mspId": "org2" }}
      ],
      "policy": {
        "2-of": [{ "signed-by": 0 }, { "signed-by": 1 }]
      }
    }
  },
  //orderer setting
  "orderer": {
    "url": "grpcs://localhost:7050",
    "server-hostname": "orderer.example.com",
    "tls_cacerts": "crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
  },
  //organization and peer/CA setting
  "org1": {
    "name": "Org1",
    "mspid": "Org1MSP",
    "ca": {
      "url": "https://localhost:7054",
      "name": "ca-org1"
    },
    "peer1": {
      "events": "grpcs://localhost:7053",
      "requests": "grpcs://localhost:7051",
      "server-hostname": "peer0.org1.example.com",
      "tls_cacerts": "crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem"
    }
  },
  //then your other orgs..
```

## Register MSP Users / MSPへのユーザー登録
`node scripts/registerUser.js` on application root.

アプリのルートディレクトリで`node scripts/registerUser.js`してください。

It'll be error if user is already registered.

ただしユーザーが登録済の場合エラーとなりますが問題ありません。

## Deploy (Install/Instantiate/Update) Chaincode / チェーコードのデプロイ
`node scripts/deploy.js` on application root.

アプリのルートディレクトリで`node scripts/deploy.js`してください。

you need to set up /config/default.json asset.chaincode property and consts on deploy.js for your installation target org and chaincode.

デプロイにあたっては/config/default.jsonのasset.chaincodeプロパティの設定とscripts/deploy.jsのconsts値の設定でデプロイ対象のチェーンコードとOrganizationなどを指定します。

## Add Owners for CarTransfer chaincode / オーナーの登録
`node scripts/addOwners.js` on application root.
アプリのルートディレクトリで`node scripts/addOwners.js`してください。

you need to add owners after deployment of CarTransfer chaincode.and this script add all MSP users as Owner.
It'll be error if owner is already registered.

CarTransferチェーンコードの利用にはこちらをつかってオーナー登録しておく必要があります。このスクリプトはregisterで登録したMSPユーザーをオーナーとして登録します。既にオーナーが登録済の場合エラーとなりますが問題ありません。
またデプロイ直後のリクエストはエラーとなる可能性があります。再実行することで正常登録できます。

## Build Application / アプリケーションのビルド
`npm run build` on application root

アプリのルートディレクトリで`npm run build`してください。
事前にnode.jsとnpmのセットアップが必要です。

## Run Application
`npm start`

you can access webapp with userid and password.
default setting is on /config/default.json users and password property.
(you should change the setting.)

アプリケーションへのアクセスは基本認証がかけられています。
/config/default.jsonのusersプロパティとpasswordプロパティが利用できます。
(デフォルト設定は必要に応じて変更ください。)

## Test fabric client code
`npm run test:node`

you need to setup config/default.json and use chaincode_example02 for test.

テストの実行にはchaincode_example02のセットアップとconfig/default.jsonの環境設定が必要です。
