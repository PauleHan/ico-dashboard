const TruffleWalletProvider = require('truffle-wallet-provider');
const {rinkebyWallet, rinkebyOracle} = require('./wallets');
const Web3 = require('web3');
const TriggmineCrowdSale = require('../app/app/blockchain/config/local/ICO.json');

//rinkeby
//const wallet = rinkebyWallet;
//const providerUrl = 'https://rinkeby.infura.io';

//local
const wallet = rinkebyWallet;
const providerUrl = 'http://localhost:8545';
const provider = new TruffleWalletProvider(wallet, providerUrl);
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contract = require('truffle-contract');

const ICO_ADDRESS = '0xd2c53da7f3d47cd08f5d41cc537cd2428f39e955';

const crowdsale = contract(TriggmineCrowdSale);
crowdsale.setProvider(provider);
const refund = async () => {
  try {
    const instance = await crowdsale.at(ICO_ADDRESS);
    console.log('softcap  ', (await instance.softCap.call()).toNumber());
    console.log('weiRaised', (await instance.weiRaised.call()).toNumber());
    console.log ('hasEnded',(await instance.isEnded.call()));
    console.log ('isFinalized  ',(await instance.isFinalized.call()));
    console.log ('isSoftCapReached  ',(await instance.isSoftCapReached()));
    console.log ('this wallet',wallet.getAddressString());
    console.log ('this owner',await instance.owner.call());

    console.log('getBalance',
        (web3.fromWei(await web3.eth.getBalance(wallet.getAddressString()))).toString(10));
    const res = await instance.claimRefund(
        {from: wallet.getAddressString(), gas: 4700000});
    console.log(res);
    console.log(res.receipt.logs);
    console.log('getBalance',
        (await web3.eth.getBalance(wallet.getAddressString())).toNumber());
  } catch (e) {
    console.log(e);
  }
};

refund();