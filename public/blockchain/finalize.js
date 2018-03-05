const TruffleWalletProvider = require('truffle-wallet-provider');
const {rinkebyWallet,rinkebyOracle} = require('./wallets');
const TriggmineCrowdSale = require('../app/app/blockchain/config/local/ICO.json');
const Web3 = require('web3');
const moment = require('moment');

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
const finalize = async () => {
  try {
    const instance = await crowdsale.at(ICO_ADDRESS);
    console.log ('isFinalized  ',(await instance.isFinalized.call()));
    console.log ('softcap  ',(await instance.softCap.call()).toNumber());
    console.log ('weiRaised',(await instance.weiRaised.call()).toNumber());
    console.log ('isEarlyInvestors',(await instance.isEarlyInvestors.call()));
    console.log ('isPreSale',(await instance.isPreSale.call()));
    console.log('block timestamp', moment((await instance.getNow())*1000));
    console.log ('preSaleStartDate',(moment((await instance.preSaleStartDate.call())*1000)));
    console.log ('preSaleEndDate',(moment((await instance.preSaleEndDate.call())*1000)));
    console.log ('mainSaleStartDate',(moment((await instance.mainSaleStartDate.call())*1000)));
    console.log ('mainSaleEndDate',(moment((await instance.mainSaleEndDate.call())*1000)));
    console.log ('isMainSale',(await instance.isMainSale.call()));
    console.log ('hasEnded',(await instance.isEnded.call()));
    console.log ('owner getBalance', web3.fromWei(await web3.eth.getBalance(await instance.wallet.call())).toString(10));
    const res = await instance.finalize({from:wallet.getAddressString(),gas:4700000});
    console.log ('owner getBalance', web3.fromWei(await web3.eth.getBalance(await instance.wallet.call())).toString(10));

    console.log(res);
    console.log(res.receipt.logs);
  }catch (e){
    console.log(e);
  }
};

finalize();