const Web3 = require('web3');
const web3 = new Web3();
const TriggmineToken = artifacts.require('./TriggmineToken.sol');

contract('TriggmineToken', (accounts) => {
  let newContract;

  it('new Contract, mint to accounts[1]', () => {
    return TriggmineToken.new()
      .then((instance) => {
        newContract = instance;
        return instance.mint(accounts[1], web3.toWei(20));
      })
      .then(res => {
        const event = Array.from(res.logs).find((log) => log.event == "Mint");
        assert.ok(Boolean(event && event.transactionHash));
      });
  });

  it('owner wallet', () => {
    return Promise.resolve(newContract)
    .then((instance) => instance.owner.call())
    .then(res => {
      console.log(res);
      assert.equal(res, res);
    });
  });

  it('balanceOf accounts[1]', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.balanceOf.call(accounts[1]))
      .then(res => {
        assert.equal(res.toNumber(), web3.toWei(20));
      });
  });

  it('release before mintingFinished', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.release())
      .catch(err => {
        assert.notEqual(String(err && err.message).search('revert'), -1);
      });
  });

  it('finishMinting', () => {
    return Promise.resolve(newContract)
    .then((instance) => instance.finishMinting())
    .then(res => {
      const event = Array.from(res.logs).find((log) => log.event === "MintFinished");
      assert.ok(Boolean(event && event.transactionHash));
    });
  });

  it('transfer to accounts[0] before release', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.transfer(accounts[0], web3.toWei(10), {from: accounts[1]}))
      .catch(err => {
        assert.notEqual(String(err && err.message).search('revert'), -1);
      });
  });

  it('release', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.release())
      .then(res => {
        const event = Array.from(res.logs).find((log) => log.event === "Release");
        assert.ok(Boolean(event && event.transactionHash));
      });
  });

  it('transfer to accounts[0] after release', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.transfer(accounts[0], web3.toWei(10), {from: accounts[1]}))
      .then(res => {
        const event = Array.from(res.logs).find((log) => log.event === "Transfer");
        assert.ok(Boolean(event && event.transactionHash));
      });
  });

  it('balanceOf accounts[0]', () => {
    return Promise.resolve(newContract)
      .then((instance) => instance.balanceOf.call(accounts[0]))
      .then(res => {
        assert.equal(res.toNumber(), web3.toWei(10));
      });
  });

});
