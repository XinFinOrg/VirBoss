var db = require('../database/models/index');
var config = require('../config/paymentListener');
const Web3 = require('web3');
var balance = require('crypto-balances');
let Promise = require('bluebird');
let provider = new Web3.providers.HttpProvider('https://rpc.apothem.network');
var web3 = new Web3(provider);

// setInterval(web3HeartBeat, 60000);

// web3.eth.net.isListening().then((s) => {
//   console.log("status check apothem: ",s);
//   return s
// }).catch((e) => {
//   return S
// });

// function web3HeartBeat(){
//   web3.eth.net.isListening().then((s) => {
//     console.log('We\'re still connected to the apothem node');
//   }).catch((e) => {
//     console.log('Lost connection to the node, reconnecting');
//     provider = new Web3.providers.HttpProvider('https://rpc.apothem.network');
//     web3.setProvider(provider);
//   });
// }

var axios = require("axios");
const siteConfig = db.siteConfig;

module.exports = {
  checkTokenBalance: async (address, tokenAddress) => {
    return new Promise(async function(resolve, reject) {
      var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
      decimals = await tokenContractInstance.methods.decimals().call();
      tokenContractInstance.methods.balanceOf(address).call().then(balance => {
        resolve(balance / 10 ** decimals);
      }).catch(async error => {
        provider = new Web3.providers.HttpProvider(config.privateProvider);
        web3.setProvider(provider);
        reject(error);
      });
    });
  },
  checkTokenStats: async (tokenAddress) => {
    return new Promise(async function(resolve, reject) {
      var tokenContractInstance = new web3.eth.Contract(config.erc20ABI, tokenAddress);
      var decimals = await tokenContractInstance.methods.decimals().call();
      console.log(decimals);
      resolve(decimals);
    });
  },
  sendEther: async (address, amount) => {
    return new Promise(async function(resolve, reject) {
    const currConfig = await siteConfig.findOne();
    const apothemPrivkey = currConfig.dataValues.apothemPrivKey;
    let txData = {
      "to": address,
      "value": amount, // "0x06f05b59d3b200000"
    };
      web3.eth.estimateGas(txData).then(gasLimit => {
        txData["gasLimit"] = gasLimit;
        // txData["gasPrice"] = gasLimit;        
        web3.eth.accounts.signTransaction(txData, apothemPrivkey).then(result => {
          console.log("SignedTransaction",result);
          axios({
              method: 'post',
              url: 'https://rpc.apothem.network',
              data: {
                "jsonrpc": "2.0",
                "method": "eth_sendRawTransaction",
                "params": [result.rawTransaction],
                "id": 1
              },
              config: {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            })
            .then(function(response) {
              //handle success
              console.log(response.data.result, "ews");
              setTimeout(function() {
                axios({
                    method: 'post',
                    url: 'https://rpc.apothem.network',
                    data: {
                      "jsonrpc": "2.0",
                      "method": "eth_getTransactionReceipt",
                      "params": [response.data.result],
                      "id": 1
                    },
                    config: {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  }).then(function(response) {
                    resolve(response.data.result)
                  })
                  .catch(function(response) {                    
                    reject(response.data)
                  });
              }, 50000);
            })
            .catch(function(response) {
              reject(response.data)
            });
        })
      })
    })
  },

  sendTokenFromTokenContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
    var contractfunc = new web3.eth.Contract(config.erc20ABI, projectData.tokenContractAddress, {
      from: address
    });
    let data = contractfunc.methods.sendTokensToCrowdsale('0x' + (tokenAmount).toString(16), tokenAddress).encodeABI()
    let txData = {
      "to": projectData.tokenContractAddress,
      "data": data,
    }
    return new Promise(async function(resolve, reject) {
      web3.eth.estimateGas({
        data: txData.data,
        from: address
      }).then(gasLimit => {
        console.log(gasLimit);
        txData["gasLimit"] = gasLimit;
        web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
          // web3.eth.sendSignedTransaction(result.rawTransaction)
          //   .on('receipt', async function(receipt) {
          //     resolve(receipt)
          //     console.log(receipt);
          //   })
          //   .on('error', async function(error) {
          //     reject(error)
          //   })
          axios({
              method: 'post',
              url: 'https://rpc.apothem.network',
              data: {
                "jsonrpc": "2.0",
                "method": "eth_sendRawTransaction",
                "params": [result.rawTransaction],
                "id": 1
              },
              config: {
                headers: {
                  "Content-Type": "application/json"
                }

              }
            })
            .then(function(response) {
              //handle success
              setTimeout(function() {
                axios({
                    method: 'post',
                    url: 'https://rpc.apothem.network',
                    data: {
                      "jsonrpc": "2.0",
                      "method": "eth_getTransactionReceipt",
                      "params": [response.data.result],
                      "id": 1
                    },
                    config: {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  }).then(function(response) {
                    console.log(response.data.result);
                    resolve(response.data.result)
                  })
                  .catch(function(response) {
                    //handle error
                    // console.log(response);
                    reject(response.data)
                  });
              }, 20000);
            })
            .catch(function(response) {
              //handle error
              // console.log(response);
              reject(response)
            });
        })
      })
    })
  },

  sendTokenFromCrowdsaleContract: async (projectData, address, tokenAmount, tokenAddress, privateKey) => {
    var contractfunc = new web3.eth.Contract(projectData.crowdsaleABICode, projectData.crowdsaleContractAddress, {
      from: address
    });
    let data = contractfunc.methods.sendTokensToCrowdsale('0x' + (tokenAmount).toString(16), tokenAddress).encodeABI()
    let txData = {
      "to": projectData.crowdsaleContractAddress,
      "data": data,
    }
    return new Promise(async function(resolve, reject) {
      web3.eth.estimateGas({
        data: txData.data,
        from: address
      }).then(gasLimit => {
        console.log(gasLimit);
        txData["gasLimit"] = gasLimit;
        web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
          // web3.eth.sendSignedTransaction(result.rawTransaction)
          //   .on('receipt', async function(receipt) {
          //     resolve(receipt)
          //   })
          //   .on('error', async function(error) {
          //     reject(error)
          //   })
          axios({
              method: 'post',
              url: 'https://rpc.apothem.network',
              data: {
                "jsonrpc": "2.0",
                "method": "eth_sendRawTransaction",
                "params": [result.rawTransaction],
                "id": 1
              },
              config: {
                headers: {
                  "Content-Type": "application/json"
                }

              }
            })
            .then(function(response) {
              //handle success
              // console.log(response);
              resolve(response)
            })
            .catch(function(response) {
              //handle error
              // console.log(response);
              reject(response)
            });
        })
      })
    })
  },

  sendTransaction: async (address, data, privateKey) => {
    let txData = {
      "data": '0x' + data,
    }
    return new Promise(async function(resolve, reject) {
      web3.eth.estimateGas({
        data: txData.data,
        from: address
      }).then(gasLimit => {
        console.log(gasLimit);
        txData["gasLimit"] = gasLimit;
        web3.eth.accounts.signTransaction(txData, privateKey).then(result => {
          axios({
              method: 'post',
              url: 'https://rpc.apothem.network',
              data: {
                "jsonrpc": "2.0",
                "method": "eth_sendRawTransaction",
                "params": [result.rawTransaction],
                "id": 1
              },
              config: {
                headers: {
                  "Content-Type": "application/json"
                }

              }
            })
            .then(function(response) {
              //handle success
              setTimeout(function() {
                axios({
                    method: 'post',
                    url: 'https://rpc.apothem.network',
                    data: {
                      "jsonrpc": "2.0",
                      "method": "eth_getTransactionReceipt",
                      "params": [response.data.result],
                      "id": 1
                    },
                    config: {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  }).then(function(response) {
                    resolve(response.data.result)
                  })
                  .catch(function(response) {
                    //handle error
                    // console.log(response);
                    reject(response.data)
                  });
              }, 50000);
            })
            .catch(function(response) {
              //handle error
              // console.log(response);
              reject(response.data)
            });
        })
      })
    })
  },
}
