const Tx = require('ethereumjs-tx');
const fs = require('fs');
const solc = require('solc');
const Web3 = new require('web3');
const cache = new require('node-memory-cache');
const web3 = new Web3();

const NONCE_TIMEOUT = 60 * 1000;
const GAS_VALUE = 4700000;

const toHex = (value) => {
  return `${value}`.startsWith('0x') ? value : '0x' + value;
};

const sendEther = async (host, wallet, data) => {
  web3.setProvider(new web3.providers.HttpProvider(host));
  const from = wallet.getAddressString();
  const params = {
    from,
    to: data.to,
    nonce: await getNonce(from),
    gasPrice: gasPrice(),
    value: web3.toWei(parseInt(data.value * 100), 'ether') / 100,
    gas: GAS_VALUE
  };
  const tx = new Tx(params);
  tx.sign(wallet.getPrivateKey());
  const serializedTx = tx.serialize();
  let hexTx = toHex(serializedTx.toString('hex'));
  return await sendRaw(hexTx);
};

const sendRaw = async (tx) => new Promise((resolve, reject) => {
  web3.eth.sendRawTransaction(tx, (err, txHash) => {
    if (err) {
      return reject(err);
    }
    return resolve(txHash);
  });
});

const sendEtherSync = async (host, wallet, data) => {
  const hash = await sendEther(host, wallet, data);
  return await waitTx(hash);
};

const getNonce = async (from) => {
  const nonce = cache.get('nonce', from);
  if (nonce !== null) {
    await _incNonce(from);
    return nonce;
  }

  const trxCount = await web3.eth.getTransactionCount(from, 'pending');
  let _nonce = await cache.get('nonce', from);
  if (_nonce !== null) {
    await _incNonce(from);
    return _nonce;
  }

  await cache.set('nonce', from, trxCount, NONCE_TIMEOUT);
  await _incNonce(from);
  return trxCount;
};

const _incNonce = async (from) => {
  const nonce = await cache.get('nonce', from);
  if (nonce !== null) {
    await cache.delete('nonce', from);
    await cache.set('nonce', from, nonce + 1, NONCE_TIMEOUT);
  }
};

let _gasPrice;
const gasPrice = () => {
  if (!_gasPrice) {
    _gasPrice = parseInt(web3.eth.gasPrice.toString());
  }
  return _gasPrice;
};

const waitTx = (hash) => new Promise((resolve, reject) => {
  const timer = setInterval(() => {
    web3.eth.getTransactionReceipt(hash, (err, tx) => {
      //console.log('Waiting transaction... hash, tx ', hash, tx);
      if (err) {
        return reject(err);
      }
      if (tx) {
        clearInterval(timer);
        return resolve(tx.contractAddress);
      }
    });
  }, 1000);
});

module.exports = sendEtherSync;