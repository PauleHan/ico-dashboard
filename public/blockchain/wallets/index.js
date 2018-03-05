const Wallet = require('ethereumjs-wallet');
const Util = require('ethereumjs-util');

const rinkebyWallet = Wallet.fromV3(require('./rinkeby/wallet.json'), '111');
const rinkebyOwner = Wallet.fromV3(require('./rinkeby/owner.json'), '111');
const rinkebyOracle = Wallet.fromV3(require('./rinkeby/oracle.json'), '111');

//const prodDeployer = Wallet.fromPrivateKey(Util.toBuffer(require('./prod/deployer-pk').pk));

module.exports = {
  rinkebyWallet,
  rinkebyOracle,
  rinkebyOwner,
  prodDeployer:''
};