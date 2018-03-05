const Wallet = require('ethereumjs-wallet');
const Util = require('ethereumjs-util');
const fs = require('fs');
const path = require('path');
const wallet = path.join(__dirname, 'triggmine-oracle.json');

fs.truncate(wallet, 0, function () {
  const w = Wallet.generate();
  const password = process.argv[2] || '111';
  console.log('password', password);
  const walletGenerated = w.toV3String(password);
  const privateKey = w.getPrivateKeyString();
  console.log('privateKey', privateKey);
  const walletFromPK = Wallet.fromPrivateKey(Util.toBuffer(privateKey));
  console.log('address', walletFromPK.getAddressString());

  fs.writeFile(wallet, walletGenerated, function (err) {
    if (err) {
      return console.log("Error writing file: " + err);
    }
  });
});
