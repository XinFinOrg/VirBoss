const Web3 = require('web3');
var db = require('../database/models/index');
var client = db.client;
const siteConfig = db.siteConfig;
var Address = db.userCurrencyAddress;
var config = require('../config/paymentListener');
var ws_provider = config.ws_provider;

const Xdc3 = require("xdc3");

const tknTransferBP = db.tokenTransferBuyPackage;

var provider = new Web3.providers.WebsocketProvider(ws_provider);
let provider_xdc = new Xdc3.providers.WebsocketProvider(ws_provider);

var web3 = new Web3(provider);
let xdc3 = new Xdc3(provider_xdc);

let Promise = require('bluebird');

let reconnActive = false;

provider_xdc.on('connect', () => console.log('WS Connected'))
provider_xdc.on('error', e => {
  console.log('WS error occured');
  console.log('Attempting to reconnect...');
  provider_xdc = new Xdc3.providers.WebsocketProvider(ws_provider);

  provider_xdc.on('connect', function () {
    console.log('WSS Reconnected');
  });

  provider_xdc.on('error', function () {
    console.log("error while reconnecting to WS at paymentListener");
    console.log("reconn interval starting...");
    reconnInterval();
  })

  xdc3.setProvider(provider_xdc);
});

setInterval(web3Heartbeat, 10000);



provider.on('connect', () => console.log('WS Connected'))
provider.on('error', e => {
  console.log('WS error occured');
  console.log('Attempting to reconnect...');
  provider = new Web3.providers.WebsocketProvider(ws_provider);

  provider.on('connect', function () {
    console.log('WSS Reconnected');
  });

  web3.setProvider(provider);
});
provider.on('end', e => {
  console.log('WS closed');
  console.log('Attempting to reconnect...');
  provider = new Web3.providers.WebsocketProvider(ws_provider);

  provider.on('connect', function () {
    console.log('WSS Reconnected');
  });

  web3.setProvider(provider);
});

var contractInstance = new web3.eth.Contract(config.erc20ABI, config.tokenAddress);
let contractInstanceXdc3;
try{
  contractInstanceXdc3 = new xdc3.eth.Contract(config.erc20ABI, formatAddress(config.tokenAddress));
}catch(e){
  console.log("Exception: ", e)
}
var gasPriceGwei = 12;
module.exports = {
  attachListener: (address) => {
    contractInstanceXdc3.once('Transfer', {
      filter: {
        from: address
      },
      fromBlock: 'pending',
      toBlock: 'latest'
    }, (err, res) => {
      console.log(err, res.returnValues);
      Address.find({
        where: {
          address: address
        }
      }).then(address => {
        address.getClient().then(async client => {
          client.package1 += 1;
          await client.save();
          // mark the TX status as complete
        });
      });
    })
  },

  attachListenerWithUserHash: async (userHash, address) => {
    const currPackPrice = await siteConfig.findOne({});
    contractInstanceXdc3.once('Transfer', {
      filter: {
        from: address,
        value: web3.utils.toWei(currPackPrice.dataValues.packagePrice)
      },
      fromBlock: 'pending',
      toBlock: 'latest'
    }, (err, res) => {
      console.log(err, res.returnValues);
      client.find({
        where: {
          uniqueId: userHash
        }
      }).then(async client => {
        client.package1 += 1;
        await client.save();
      });
    });
  },
// send token from user's address to diversion address
  sendToParent: (address, privateKey, clientId) => {
    return new Promise(async function (resolve, reject) {
      const currSiteConfig = await siteConfig.findOne({});
      address = formatAddress(address);
      tknAddrXDC = formatAddress(config.tokenAddress);
      divAddrXDC = formatAddress(currSiteConfig.dataValues.diversionAddress);
      var amountToSend = xdc3.utils.toWei('0.001', 'ether');
      var rawTransaction = {
        "gasPrice": xdc3.utils.toHex(gasPriceGwei * 1e9+""),
        "gasLimit": xdc3.utils.toHex(30000+""),
        "to": address,
        "value": amountToSend
      };
      const currPackagePrice = currSiteConfig.dataValues.packagePrice;
      xdc3.eth.accounts.signTransaction(rawTransaction, currSiteConfig.dataValues.xinfinPrivKey || config.xinfinPrivKey).then(result => {
        xdc3.eth.sendSignedTransaction(result.rawTransaction).then( async receipt => {
          console.log("Ether receipt generated");
          var transaction = {
            "from": address,
            "gasPrice": xdc3.utils.toHex(gasPriceGwei * 1e9+""),
            "to": tknAddrXDC,
            "value": "0x0",
            "data": contractInstanceXdc3.methods.transfer((currSiteConfig.dataValues.diversionAddress), xdc3.utils.toWei(currSiteConfig.dataValues.packagePrice)).encodeABI()
          };
          xdc3.eth.estimateGas(transaction).then(gasLimit => {
            transaction["gasLimit"] = gasLimit;
            xdc3.eth.accounts.signTransaction(transaction, privateKey).then(result => {
              let currLog;
              xdc3.eth.sendSignedTransaction(result.rawTransaction).once('transactionHash',async (hash) => {
                currLog =  await generateBuyPackLogTkn(xdc3.utils.toWei(currPackagePrice),address, config.tokenAddress, hash, "viro", clientId);
                console.log("log generated");
              }).then(receipt => {
                if (receipt.status=="0x1"){
                  console.log("receipt status true !");
                  currLog.tokenTransferStatus = "completed";
                  currLog.save().then(res => console.log("updated the log status."));                  
                  resolve(receipt);
                }                
              });
            });
          });
        });
      });
    });
  },

  checkBalance: (address) => {
    return new Promise(function (resolve, reject) {
      contractInstanceXdc3.methods.balanceOf((address)).call().then(balance => {
        resolve(balance / 10 ** 18);
      }).catch(error => {
        console.log("check balance error: ", error)
        reject(error);
      });
    });
  },

  checkEtherBalance: (address) => {
    return new Promise(function (resolve, reject) {
      xdc3.eth.getBalance(formatAddress(address)).then(balance => {
        resolve(xdc3.utils.fromWei(balance));
      }).catch(error => {
        console.log("Web3 error status", error);
        provider_xdc = new Xdc3.providers.WebsocketProvider(ws_provider);
        xdc3.setProvider(provider_xdc);
        reject(error);
      });
    });
  },
  // where is this used????
  sendToken: (address, amount) => {
    return new Promise(function (resolve, reject) {
      var provider = new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws');
      var web3 = new Web3(provider);
      console.log("Ether receipt generated");
      var transaction = {
        "from": "0x14649976AEB09419343A54ea130b6a21Ec337772",
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "to": "0xc573c48aD1037DD92cB39281e5f55DCb5e033A70",
        "value": "0x0",
        "data": contractInstance.methods.transfer(address, amount + "000000000000000000").encodeABI()
      };
      web3.eth.estimateGas(transaction).then(gasLimit => {
        transaction["gasLimit"] = gasLimit;
        web3.eth.accounts.signTransaction(transaction, "0x25F8170BA33240C0BD2C8720FE09855ADA9D07E38904FC5B6AEDCED71C0A3142").then(result => {
          web3.eth.sendSignedTransaction(result.rawTransaction).then(receipt => {
            resolve(receipt);
          });
        });
      });
    })
  }
}

function generateBuyPackLogTkn(amnt, from, to, txHash, tknName, clientId) {
  return new Promise(async (resolve, reject) => {
    const newLog = new Object();
    newLog.tokenAmount = amnt;
    newLog.fromAddress = from;
    newLog.toAddress = to;
    newLog.transaction_hash = txHash;
    newLog.tokenTransferStatus = "pending";
    newLog.tokenName = tknName;
    newLog.recipientClientId = clientId;
    const createdLog = await tknTransferBP.create(newLog);
    resolve(createdLog);
  })
}

function formatAddress(addr0X){
  if (addr0X.startsWith("0x")){
    return "xdc" + addr0X.substring(2).toLowerCase();
  }
  else if (addr0X.startsWith("xdc")) return addr0X.toLowerCase();
  else return null
}

async function web3Heartbeat() {
  try {
    const isListening = await xdc3.eth.net.isListening();
    if (isListening !== true) {
      if (reconnActive !== true) reconnInterval();
    }
  } catch (e) {
    console.log("exception at web3Heartbeat: ", e);
    if (reconnActive !== true) reconnInterval();
  }
}

function reconnInterval() {
  console.log("called reconnInterval");
  reconnActive = true;
  const reconnInt = setInterval(() => {
    console.log("retrying xdc3 connection in package-cart/paymentListener...");
    provider_xdc = new Xdc3.providers.WebsocketProvider(ws_provider);
    xdc3.setProvider(provider_xdc);

    provider_xdc.on("connect", () => {
      console.log("WS reconnected in package-cart/paymentListener");
      clearInterval(reconnInt);
      reconnActive = false;
    });
  }, 30000);
}