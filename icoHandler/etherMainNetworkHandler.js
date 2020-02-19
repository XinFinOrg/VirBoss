var db = require('../database/models/index');
var config = require('../config/paymentListener');
var balance = require('crypto-balances');
let Promise = require('bluebird');
const Web3 = require('web3');
var web3 = new Web3();
const siteConfig = db.siteConfig;
var provider = new Web3.providers.WebsocketProvider(config.ws_provider);
const ws_provider = config.ws_provider;

let reconnActive=false;

web3.setProvider(provider);

provider.on("connect", () => {
  console.log("WS Connected in etherMainnetNetworkHandler");
});

provider.on("error", e => {
  console.log("WS error occured in etherMainnetNetworkHandler");
  console.log("Attempting to reconnect...");
  provider = new Web3.providers.WebsocketProvider(ws_provider);
  provider.on("connect", () => {
    console.log("WSS Reconnected in etherMainnetNetworkHandler");
  });

  provider.on("error", () => {
    console.log("wss disconnected 2nd time in etherMainnetNetworkHandler");
    console.log("connecting to backup WS...");
    provider = new Web3.providers.WebsocketProvider(ws_provider_backup);
    web3.setProvider(provider);
    provider.on("connect", () => {
      console.log("WSS Reconnected in etherMainnetNetworkHandler");
    });

    provider.on("error", () => {
      console.log("failed to connect to backup ws");
      console.log("starting the reconnection loop...");
      reconnInterval();
    });
  });
  web3.setProvider(provider);
});

setInterval(web3Heartbeat,10000);

module.exports = {
    checkBalance: (address) => {
        return new Promise(function (resolve, reject) {
            balance(address, function (err, result) {
                if (err)
                    reject(err);
                resolve(result[0].quantity);
            });
        });
    },

    checkEtherBalance: (address) => {
        return new Promise(function (resolve, reject) {
            web3.eth.getBalance(address).then(balance => {
                resolve(web3.utils.fromWei(balance));
            }).catch(error => {
                console.log("Web3 error status", error);
                provider = new Web3.providers.WebsocketProvider(ws_provider);
                web3.setProvider(provider);
                reject(error);
            });
        });
    },

    checkTokenBalance: async (address, tokenAddress) => {
        console.log(tokenAddress);
        return new Promise(async function (resolve, reject) {
            var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
            decimals = await tokenContractInstance.methods.decimals().call();
            tokenContractInstance.methods.balanceOf(address).call().then(balance => {
                resolve(balance / 10 ** decimals);
            }).catch(async error => {
                provider = new Web3.providers.WebsocketProvider(ws_provider);
                web3.setProvider(provider);
                reject(error);
            });
        });
    },

    sendTokenFromTokenContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
        var contractfunc = new web3.eth.Contract(config.erc20ABI, projectData.tokenContractAddress, { from: address });
        let data = contractfunc.methods.sendTokensToCrowdsale('0x' + (tokenAmount).toString(16), tokenAddress).encodeABI()
        let txData = {
            "nonce": await web3.eth.getTransactionCount(address),
            "to": projectData.tokenContractAddress,
            "data": data,
        }
        // console.log("encoded Abi",txData)
        return new Promise(async function (resolve, reject) {
            web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('confirmation', async function (confirmationNumber, receipt) {
                            if (confirmationNumber == 1) {
                                if (receipt.status == true) {
                                    resolve(receipt)
                                }
                            }
                        })
                        .on('error', async function (error) {
                            console.log("Error while transferring token".error)
                            reject(error) 
                            })
                })
            })
        })
    },

    // sendTokenFromcrowdsaleContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
    //     var contractfunc = new web3.eth.Contract(config.crowdsaleABI, projectData.crowdsaleContractAddress, { from: address });
    //     let data = contractfunc.methods.dispenseTokensToInvestorAddressesByValue(tokenAddress, tokenAmount).encodeABI();
    //     let txData = {
    //         "nonce": await web3.eth.getTransactionCount(address),
    //         "data": data,
    //         'to': projectData.crowdsaleContractAddress,
    //     }
    //     return new Promise(async function (resolve, reject) {
    //         web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
    //             console.log(gasLimit);
    //             txData["gasLimit"] = gasLimit;
    //             web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
    //                 web3.eth.sendSignedTransaction(result.rawTransaction)
    //                     .on('confirmation', async function (confirmationNumber, receipt) {
    //                         if (confirmationNumber == 1) {
    //                             if (receipt.status == true) {
    //                                 resolve(receipt)
    //                             }
    //                         }
    //                     })
    //                     .on('error', async function (error) { reject(error) })
    //             })
    //         })
    //     })
    // },

    buyToken: (fromAddress, toAddress, privateKey, value) => {
        var amountToSend = web3.utils.toWei(value, 'ether');
        return new Promise((resolve, reject) => {
            var transaction = {
                "from": fromAddress,
                "to": toAddress,
                "value": amountToSend
            };
            web3.eth.estimateGas(transaction).then(gasLimit => {
                transaction["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(transaction, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction).then(receipt => {
                        resolve(receipt);
                    });
                }).catch(async error => {
                    provider = new Web3.providers.WebsocketProvider(ws_provider);
                    web3.setProvider(provider);
                    reject(error);
                });
            });
        });
    },

    checkTokenStats: async (tokenAddress) => {
        return new Promise(async function (resolve, reject) {
            var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
            var decimals = await tokenContractInstance.methods.decimals().call();
            console.log(decimals);
            resolve(decimals);
        });
    },

    sendEther: async (address, amount) => {
        return new Promise(async function (resolve, reject) {
            const currConfig = await siteConfig.findOne();
            const xinfinPrivKey = currConfig.dataValues.xinfinPrivKey;
            const xinfinAddress = currConfig.dataValues.xinfinAddress;
            var txData = {
                "nonce": await web3.eth.getTransactionCount(xinfinAddress),
                "to": address,
                "value": amount, // "0x06f05b59d3b200000"
            }
            web3.eth.estimateGas(txData).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = '0x5208';
                web3.eth.accounts.signTransaction(txData, xinfinPrivKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('receipt', async function (receipt) { resolve(receipt) })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    },

    sendTransaction: async (address, data, privateKey) => {
        return new Promise(async function (resolve, reject) {
            let txData = {
                "nonce": await web3.eth.getTransactionCount(address),
                "data": '0x' + data,
                // "gasPrice": "0x170cdc1e00",
                // "gasLimit": "0x2625A0",
            }
            web3.eth.estimateGas({ data: txData.data, from: address }).then(gasLimit => {
                console.log(gasLimit);
                txData["gasLimit"] = gasLimit;
                web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
                    web3.eth.sendSignedTransaction(result.rawTransaction)
                        .on('confirmation', async function (confirmationNumber, receipt) {
                            if (confirmationNumber == 3) {
                                if (receipt.status == true) {
                                    resolve(receipt)
                                }
                            }
                        })
                        .on('error', async function (error) { reject(error) })
                })
            })
        })
    }
}

async function web3Heartbeat() {
    try {
      const isListening = await web3.eth.net.isListening();
      if (isListening!==true) {
        if (reconnActive!==true) reconnInterval();
      }
    } catch (e) {
      console.log("exception at web3Heartbeat: ", e);
      if (reconnActive!==true) reconnInterval();
    }
  }
  
  function reconnInterval() {
    console.log("called reconnInterval");
    reconnActive=true;
    const reconnInt = setInterval(() => {
      console.log("retrying web3 connection in etherMainNetworkHandler...");
      provider = new Web3.providers.WebsocketProvider(ws_provider);
      web3.setProvider(provider);
  
      provider.on("connect", () => {
        console.log("WS reconnected in etherMainNetworkHandler");
        clearInterval(reconnInt);
        reconnActive=false;
      });
    }, 30000);
  }