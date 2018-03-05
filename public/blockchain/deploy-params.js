const moment = require('moment');

const getTimeByStep = (() =>{
  let timeStep = 10;
  let currentTime = 20;
  return () => {
    currentTime+=timeStep;
    console.log(moment().add(currentTime, 'm'));
    return Math.floor(moment().add(currentTime, 'm') / 1000);
  }
})();

module.exports = {
  /*_local1:{
    adminWallet: '0x66875e3367747926dadac2efab78a8593597373d',
    earlyInvestorsStartDate: Math.floor(moment() / 1000) - 20,
    earlyInvestorsEndDate: Math.floor((moment() / 1000)) - 19,
    preSaleStartDate: Math.floor((moment() / 1000)) - 18,
    preSaleFirstTwoDaysEndDate: Math.floor((moment() / 1000)) - 17,
    preSaleThirdDayEndDate: Math.floor((moment() / 1000)) - 16,
    preSaleFourthDayEndDate: Math.floor((moment() / 1000)) - 15,
    preSaleFifthDayEndDate: Math.floor((moment() / 1000)) - 14,
    preSaleSixthDayEndDate: Math.floor((moment() / 1000)) - 13,
    preSaleEndDate: Math.floor((moment() / 1000)) - 12,
    mainSaleStartDate: Math.floor((moment() / 1000)) - 11,
    mainSaleFirstThreeDaysEndDate: Math.floor((moment() / 1000)) - 10,
    mainSaleFirstFourthSeventhDaysEndDate: Math.floor((moment() / 1000)) - 9,
    mainSaleEndDate: getTimeByStep(),
  },
  local:{
    adminWallet: '0x66875e3367747926dadac2efab78a8593597373d',
    preSaleStartDate: getTimeByStep(),
    preSaleFirstTwoDaysEndDate: getTimeByStep(),
    preSaleThirdDayEndDate: getTimeByStep(),
    preSaleFourthDayEndDate: getTimeByStep(),
    preSaleFifthDayEndDate: getTimeByStep(),
    preSaleSixthDayEndDate: getTimeByStep(),
    preSaleEndDate: getTimeByStep(),
    mainSaleStartDate: getTimeByStep(),
    mainSaleFirstThreeDaysEndDate: getTimeByStep(),
    mainSaleFirstFourthSeventhDaysEndDate: getTimeByStep(),
    mainSaleEndDate: getTimeByStep(),
  },*/
  rinkeby:{
    adminWallet: '0x66875E3367747926dadAC2eFaB78a8593597373d',
    oracleWallet: '0x9d8f9C02e4BC9fEaC038f1fE4Cb02C1e6626C2a2',
    preSaleStartDate: getTimeByStep(),
    preSaleFirstTwoDaysEndDate: getTimeByStep(),
    preSaleThirdDayEndDate: getTimeByStep(),
    preSaleFourthDayEndDate: getTimeByStep(),
    preSaleFifthDayEndDate: getTimeByStep(),
    preSaleSixthDayEndDate: getTimeByStep(),
    preSaleEndDate: getTimeByStep(),
    mainSaleStartDate: getTimeByStep(),
    mainSaleFirstThreeDaysEndDate: getTimeByStep(),
    mainSaleFirstFourthSeventhDaysEndDate: getTimeByStep(),
    mainSaleEndDate: getTimeByStep(),
  },
  _network: null,
  setNetwork: function (network){
    this._network = network;
  },
  getParams: function () {
    return this[this._network]
  }
};
