const TruffleWalletProvider = require('truffle-wallet-provider');
const {rinkebyWallet, prodDeployer} = require('./wallets');
module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      network_id: 'local',
      gasPrice: 25000000000,//25 Gwei
    },
    rinkeby: {
      provider: () => {
        return new TruffleWalletProvider(rinkebyWallet, 'https://rinkeby.infura.io');
      },
      from: rinkebyWallet.getAddressString(),
      gasPrice: 40000000000,//25 Gwei
      network_id: 'rinkeby',
    },
    /*prod: {
      provider: () => {
        return new TruffleWalletProvider(prodDeployer, 'https://mainnet.infura.io');
      },
      from: prodDeployer.getAddressString(),
      gasPrice: 25000000000,//25 Gwei
      network_id: 'live' // Match any network id - 'https://mainnet.infura.io'
    },*/
  },
};
