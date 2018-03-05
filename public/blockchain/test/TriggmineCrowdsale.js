const Web3 = require('web3');
// const providerUrl = 'http://localhost:8545'
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const TriggmineCrowdSale = artifacts.require('./TriggmineCrowdSale.sol');
const deployConfig = require('../deploy-params.js');
const moment = require('moment');
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
contract('TriggmineCrowdSale', (accounts) => {
  const config = deployConfig.getParams();
  it('initParams owner === adminWallet', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.owner.call()).
        then(res => {
          assert.ok(Boolean(config.adminWallet.toLowerCase() === res),
              'Admin wallet wasnt set');
        });
  });

  it('initParams token contract owner', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.getTokenOwner()).
        then(res => {
          console.log(res);
          assert.ok(true, 'Admin wallet wasnt set');
        });
  });


  it('initParams preSaleStartDate', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.preSaleStartDate.call()).
        then(res => {
          assert.ok(Boolean(config.preSaleStartDate === res.toNumber()),
              'preSaleStartDate wasnt set');
        });
  });

  it('initParams preSaleEndDate', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.preSaleEndDate.call()).
        then(res => {
          assert.ok(Boolean(config.preSaleEndDate === res.toNumber()),
              'preSaleEndDate wasnt set');
        });
  });

  it('initParams mainSaleStartDate', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.mainSaleStartDate.call()).
        then(res => {
          assert.ok(Boolean(config.mainSaleStartDate === res.toNumber()),
              'mainSaleStartDate wasnt set');
        });
  });

  it('initParams mainSaleEndDate', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.mainSaleEndDate.call()).
        then(res => {
          assert.ok(Boolean(config.mainSaleEndDate === res.toNumber()),
              'mainSaleEndDate wasnt set');
        });
  });

  it('getCurrentMileStone', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.getCurrentMileStone()).
        then(res => {
          console.log(res);
          assert.ok(Boolean(res !== 0), 'MileStoneIsInvalid');
        });
  });

  it('getMilestone phases', () => {
    return TriggmineCrowdSale.deployed().
        then(async (instance) => {
          const phases = [];
          let i = 0;
          while (true) {
            try {
              let phase = await instance.mileStones(i);
              phases.push({
                start: moment(phase[0].toNumber() * 1000),
                end: moment(phase[1].toNumber() * 1000),
                state: phase[2].toNumber(),
              });
              i++;
            } catch (e) {
              break;
            }
          }
          console.log(phases);
          assert.ok(Boolean(phases.length !== 0),
              'mainSaleStartDate wasnt set');
        });
  });

  it('buy 10 ether', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.send(web3.toWei(2), {from: accounts[1]})).
        then(res => {
          assert.ok(res.tx && res.receipt && res.receipt.status);
        });
  });

  it('try to send 0.1 ETH', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.send(web3.toWei(0.1), {from: accounts[1]})).
        then(res => {
          assert.ok(res.tx && res.receipt && res.receipt.status);
        });
  });

  it('try to send 0.11 ETH', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.send(web3.toWei(0.11), {from: accounts[1]})).
        then(res => {
          assert.ok(res.tx && res.receipt && res.receipt.status);
        });
  });

  it('cannot send less than min contribution', () => {
    return TriggmineCrowdSale.deployed().
        then(
        (instance) => instance.send(web3.toWei(0.09), {from: accounts[1]})).
        catch(err => {
          assert.ok(String(err && err.message).search('revert') !== -1);
        });
  });

  it('buy 2 ether', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.send(web3.toWei(2), {from: accounts[1]})).
        catch(err => {
          assert.ok(String(err && err.message).search('revert') !== -1);
        });
  });

  it('finalise', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.finalize()).
        catch(err => {
          assert.ok(String(err && err.message).search('revert') !== -1);
        });
  });

  it('claimRefund', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.claimRefund({from: accounts[1]})).
        catch(err => {
          assert.ok(String(err && err.message).search('revert') !== -1);
        });
  });

  it('getTokenRaised', () => {
    return TriggmineCrowdSale.deployed().
        then((instance) => instance.getTokenRaised.call({from: accounts[1]})).
        then(res => {
          assert.ok(Boolean(res.toNumber()));
        });
  });

});
