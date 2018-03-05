const TruffleWalletProvider = require('truffle-wallet-provider');
const {rinkebyWallet,rinkebyOracle} = require('./wallets');
const TriggmineCrowdSale = require('../app/app/blockchain/config/local/ICO.json');
const Web3 = require('web3');
const transfer = require('./helpers/transfer');
const moment = require('moment');

//rinkeby
//const wallet = rinkebyWallet;
const providerUrl = 'https://rinkeby.infura.io';
//local
const wallet = rinkebyWallet;
//const providerUrl = 'http://localhost:8545';

const provider = new TruffleWalletProvider(wallet, providerUrl);
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contract = require('truffle-contract');

//const ICO_ADDRESS = '0x99497ab2846d4186ef8bdc1f052f4aaf86b41e64';
const ICO_ADDRESS = '0xe82815a80726fbe9527f896331774def68651e0c';

const testAddress1 = '0x39f0ca3d145a916746d57f8f86a485716abbdb39';
const testAddress2 = '0x786e046e2273500b7722fe81242d2ce3ea8d4d51';

const crowdsale = contract(TriggmineCrowdSale);
crowdsale.setProvider(provider);
const pay = async () => {
  try {
    let res = '';
    const instance = await crowdsale.at(ICO_ADDRESS);
    console.log('state', (await instance.getCurrentMileStone()).toNumber());
    console.log ('weiRaised',web3.fromWei(await instance.weiRaised.call()).toString(10));
    console.log('token raised', (await instance.getTokenRaised()).toNumber());
    console.log ('wallet',(await instance.wallet.call()));
    console.log ('owner',(await instance.owner.call()));
    console.log ('oracle',(await instance.oracle.call()));
    console.log ('preSaleStartDate',(moment((await instance.preSaleStartDate.call())*1000)));
    console.log ('preSaleEndDate',(moment((await instance.preSaleEndDate.call())*1000)));
    console.log ('mainSaleStartDate',(moment((await instance.mainSaleStartDate.call())*1000)));
    console.log ('mainSaleEndDate',(moment((await instance.mainSaleEndDate.call())*1000)));
    /*await transfer(providerUrl, wallet, {
      to: ICO_ADDRESS,
      value:0.5
    });*/

    /*console.log ('btcToWeiRaised',await instance.btcToWeiRaised.call());
    console.log ('btcToTokenRaised',await instance.btcToTokenRaised.call());
    console.log ('isAddress',web3.isAddress(testAddress1));
    console.log('tokens amount', (await instance.getTokenAmountByWallet(testAddress1)).toNumber());
    res = await instance.buyTokensForBtc(testAddress1, web3.toWei(10, 'ether'), 1, {
      from: wallet.getAddressString(), gas: 4700000
    });*/

    /*console.log ('getBalance',(await web3.eth.getBalance(wallet.getAddressString())).toNumber())
    console.log('tokens amount', (await instance.getTokenAmountByWallet(testAddress1)).toNumber());
    console.log ('btcToWeiRaised',web3.fromWei(await instance.btcToWeiRaised.call()).toString(10));
    console.log ('btcToTokenRaised',await instance.btcToTokenRaised.call());
    console.log ('cashToWeiRaised',web3.fromWei(await instance.cashToWeiRaised.call()).toString(10));
    console.log ('cashToUsdRaised',await instance.cashToUsdRaised.call());
    console.log ('cashToTokenRaised',await instance.cashToTokenRaised.call());
    res = await instance.buyTokensForCash(testAddress2, 100000, web3.toWei(10, 'ether'), 1,{
      from: wallet.getAddressString(), gas: 4700000
    });

    console.log('tokens amount', (await instance.getTokenAmountByWallet(testAddress2)).toNumber());
    console.log ('cashToWeiRaised',web3.fromWei(await instance.cashToWeiRaised.call()).toString());
    console.log ('cashToUsdRaised',await instance.cashToUsdRaised.call());
    console.log ('cashToTokenRaised',await instance.cashToTokenRaised.call());
    console.log('state', (await instance.getCurrentMileStone()).toNumber());

    //console.log('tokens amount', (await instance.getTokenAmountByWallet(wallet.getAddressString())).toNumber());
    console.log('weiRaised', (web3.fromWei(await instance.weiRaised.call()).toString(10)));
    console.log('getWeiRaised', (web3.fromWei(await instance.getWeiRaised()).toString(10)));*/

  }catch (e){
    console.log(e);
  }
};

pay();