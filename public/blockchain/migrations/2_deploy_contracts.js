const fs = require('fs');
const path = require('path');
const moment = require('moment');

const TriggmineToken = artifacts.require('./TriggmineToken');
const TriggmineCrowdSale = artifacts.require('./TriggmineCrowdSale');
const deployConfig = require('../deploy-params.js');

module.exports = function(deployer, network, accounts) {
  deployConfig.setNetwork(network);
  const args = deployConfig.getParams();
  //args.adminWallet = accounts[0];
  deployContract(deployer, args);
};

const deployContract = (deployer, {
  adminWallet,
  oracleWallet,
  preSaleStartDate,
  preSaleFirstTwoDaysEndDate,
  preSaleThirdDayEndDate,
  preSaleFourthDayEndDate,
  preSaleFifthDayEndDate,
  preSaleSixthDayEndDate,
  preSaleEndDate,
  mainSaleStartDate,
  mainSaleFirstThreeDaysEndDate,
  mainSaleFirstFourthSeventhDaysEndDate,
  mainSaleEndDate,
}) => {
  console.log('Presale: start', moment(preSaleStartDate * 1000));
  console.log('Presale: 1-2 days end', moment(preSaleFirstTwoDaysEndDate * 1000));
  console.log('Presale: 3 day end', moment(preSaleThirdDayEndDate * 1000));
  console.log('Presale: 4 day end', moment(preSaleFourthDayEndDate * 1000));
  console.log('Presale: 5 day end', moment(preSaleFifthDayEndDate * 1000));
  console.log('Presale: 6 day end', moment(preSaleSixthDayEndDate * 1000));
  console.log('Presale: end', moment(preSaleEndDate * 1000));

  console.log('Mainsale: start', moment(mainSaleStartDate * 1000));
  console.log('Mainsale: 1-3 days end', moment(mainSaleFirstThreeDaysEndDate * 1000));
  console.log('Mainsale: 4-7 days end', moment(mainSaleFirstFourthSeventhDaysEndDate * 1000));
  console.log('Mainsale: end', moment(mainSaleEndDate * 1000));
  deployer.deploy(TriggmineToken).then(() => {
    return deployer.deploy(TriggmineCrowdSale, TriggmineToken.address);
  }).then(() => {
    console.log('\n');
    console.log(`export const tokenContractAddress = '${TriggmineToken.address}';`);
    console.log(`export const icoAddress = '${TriggmineCrowdSale.address}';`);

    console.log('\n');
  })
  .then(() => TriggmineCrowdSale.deployed())
  .then(async (deployed) => {
    console.log(`export const vault = '${await deployed.vault.call()}';`);
    console.log('setPreSaleFirstTwoDaysMileStone');
    console.log('preSaleStartDate %s, equivalent to %',preSaleStartDate, moment(preSaleStartDate * 1000));
    console.log('preSaleFirstTwoDaysEndDate %s, equivalent to  %',preSaleFirstTwoDaysEndDate, moment(preSaleFirstTwoDaysEndDate * 1000));
    await deployed.setPreSaleFirstTwoDaysMileStone(
        preSaleStartDate,
        preSaleFirstTwoDaysEndDate
    );

    console.log('setPreSaleThirdDayMileStone');
    console.log('preSaleFirstTwoDaysEndDate %s, equivalent to %',preSaleFirstTwoDaysEndDate, moment(preSaleFirstTwoDaysEndDate * 1000));
    console.log('preSaleThirdDayEndDate %s, equivalent to %',preSaleThirdDayEndDate, moment(preSaleThirdDayEndDate * 1000));
    await deployed.setPreSaleThirdDayMileStone(
        preSaleFirstTwoDaysEndDate,
        preSaleThirdDayEndDate
    );

    console.log('setPreSaleFourthDayMileStone');
    console.log('preSaleThirdDayEndDate %s, equivalent to %',preSaleThirdDayEndDate, moment(preSaleThirdDayEndDate * 1000));
    console.log('preSaleFourthDayEndDate %s, equivalent to %',preSaleFourthDayEndDate, moment(preSaleFourthDayEndDate * 1000));
    await deployed.setPreSaleFourthDayMileStone(
        preSaleThirdDayEndDate,
        preSaleFourthDayEndDate
    );

    console.log('setPreSaleFifthDayMileStone');
    console.log('preSaleFourthDayEndDate %s, equivalent to %',preSaleFourthDayEndDate, moment(preSaleFourthDayEndDate * 1000));
    console.log('preSaleFifthDayEndDate %s, equivalent to %',preSaleFifthDayEndDate, moment(preSaleFifthDayEndDate * 1000));
    await deployed.setPreSaleFifthDayMileStone(
        preSaleFourthDayEndDate,
        preSaleFifthDayEndDate
    );

    console.log('setPreSaleSixthDayMileStone');
    console.log('preSaleFifthDayEndDate %s, equivalent to %',preSaleFifthDayEndDate, moment(preSaleFifthDayEndDate * 1000));
    console.log('preSaleSixthDayEndDate %s, equivalent to %',preSaleSixthDayEndDate, moment(preSaleSixthDayEndDate * 1000));
    await deployed.setPreSaleSixthDayMileStone(
        preSaleFifthDayEndDate,
        preSaleSixthDayEndDate
    );

    console.log('setPreSaleLastDaysMileStone');
    console.log('preSaleSixthDayEndDate %s, equivalent to %',preSaleSixthDayEndDate, moment(preSaleSixthDayEndDate * 1000));
    console.log('preSaleEndDate %s, equivalent to %',preSaleEndDate, moment(preSaleEndDate * 1000));
    await deployed.setPreSaleLastDaysMileStone(
        preSaleSixthDayEndDate,
        preSaleEndDate
    );

    console.log('setMainSaleFirstThreeDaysMileStone');
    console.log('mainSaleStartDate %s, equivalent to %',mainSaleStartDate, moment(mainSaleStartDate * 1000));
    console.log('mainSaleFirstThreeDaysEndDate %s, equivalent to %',mainSaleFirstThreeDaysEndDate, moment(mainSaleFirstThreeDaysEndDate * 1000));
    await deployed.setMainSaleFirstThreeDaysMileStone(
        mainSaleStartDate,
        mainSaleFirstThreeDaysEndDate
    );

    console.log('setMainSaleFourthSeventhDaysMileStone');
    console.log('mainSaleFirstThreeDaysEndDate %s, equivalent to %',mainSaleFirstThreeDaysEndDate, moment(mainSaleFirstThreeDaysEndDate * 1000));
    console.log('mainSaleFirstFourthSeventhDaysEndDate %s, equivalent to %',mainSaleFirstFourthSeventhDaysEndDate, moment(mainSaleFirstFourthSeventhDaysEndDate * 1000));
    await deployed.setMainSaleFourthSeventhDaysMileStone(
        mainSaleFirstThreeDaysEndDate,
        mainSaleFirstFourthSeventhDaysEndDate
    );

    console.log('setMainSaleLastDaysMileStone');
    console.log('mainSaleFirstFourthSeventhDaysEndDate %s, equivalent to %',mainSaleFirstFourthSeventhDaysEndDate, moment(mainSaleFirstFourthSeventhDaysEndDate * 1000));
    console.log('mainSaleEndDate %s, equivalent to %',mainSaleEndDate, moment(mainSaleEndDate * 1000));
    await deployed.setMainSaleLastDaysMileStone(
        mainSaleFirstFourthSeventhDaysEndDate,
        mainSaleEndDate
    );

    return TriggmineCrowdSale.deployed();
  })
  .then(() => TriggmineToken.deployed())
  .then((deployed) => {
    return deployed.transferOwnership(TriggmineCrowdSale.address)
  })
  .then(() => TriggmineCrowdSale.deployed())
  .then((deployed) => deployed.setOracle(oracleWallet))
  .then((res) => console.log(
      'oracle set to ' + oracleWallet
  ))
  .then(() => TriggmineCrowdSale.deployed())
  .then((deployed) => deployed.transferOwnership(adminWallet))
  .then((res) => console.log(
      'change TrustaBitCrowdsale transferOwnership to',
      adminWallet,
      '\n transaction', res.tx,
      '\n status', Boolean(res.receipt.status)
  ))
  .then(() => {
    save(deployer.network, TriggmineCrowdSale.toJSON(), TriggmineCrowdSale.address, TriggmineToken.address);
  });
};

const buildPath = path.join(__dirname, '..', '..', 'app', 'app', 'blockchain', 'config');
const buildPathAdmin = path.join(__dirname, '..', '..', 'admin', 'app', 'blockchain', 'config');

const save = (network, dataCrowdsale, addressCrowdsale, addressToken) => {
  console.log('\n\n** SAVE APP DATA **\n');
  const savePath = path.join(buildPath, network);
  const savePathAdmin = path.join(buildPathAdmin, network);

  const {contractName, abi} = dataCrowdsale;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }
  
  if (!fs.existsSync(savePathAdmin)) {
    fs.mkdirSync(savePathAdmin);
  }

  fs.writeFileSync(path.join(savePath, 'ICO.json'), JSON.stringify({contractName, abi}), 'utf8');
  fs.writeFileSync(path.join(savePathAdmin, 'ICO.json'), JSON.stringify({contractName, abi}), 'utf8');

  const ethJs = `
      export const tokenContractAddress = '${addressToken}';
      export const icoAddress = '${addressCrowdsale}';
      
      export const provider = '${ethProvider(network)}';
      export const providerScan = '${ethProviderScan(network)}';
  `;

  fs.writeFileSync(path.join(savePath, 'eth.js'), ethJs.trim(), 'utf8');
  fs.writeFileSync(path.join(savePathAdmin, 'eth.js'), ethJs.trim(), 'utf8');
  
  console.log(dataCrowdsale.compiler);
};

const ethProvider = (network) => {
  switch (network) {
    case 'prod':
      return 'https://mainnet.infura.io';
    case 'rinkeby':
      return 'https://rinkeby.infura.io';
  }
  return 'http://localhost:8545';
};

const ethProviderScan = (network) => {
  switch (network) {
    case 'prod':
      return 'https://etherscan.io/tx';
    case 'rinkeby':
      return 'https://rinkeby.etherscan.io/tx';
  }
  return 'http://localhost:8545';
};
// module.exports = function(deployer, network, accounts) {
//
// };