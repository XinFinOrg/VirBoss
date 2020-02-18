const Web3 = require("web3");
const Xdc3 = require("xdc3");
const _ = require("lodash");
const db = require("../database/models/index");
const config = require("../config/paymentListener");
const ws_provider = config.ws_provider;
let provider = new Xdc3.providers.WebsocketProvider(ws_provider);
const web3 = new Xdc3(provider);
const { Op } = require("sequelize");

const referralLogs = db.referralLogs;
const tokenTransferRollout = db.tokenTransferRollout;
const tokentransferBuyPackage = db.tokenTransferBuyPackage;
const tokenTransferTokenBuy = db.tokenTransferTokenBuy;
const client = db.client;
const userCurrAddr = db.userCurrencyAddress;
const projectConfiguration = db.projectConfiguration;
const siteConfig = db.siteConfig;

let reconnActive = false;

provider.on("connect", () => console.log("WS Connected in admin/services"));
provider.on("error", e => {
  console.log("WS error occured in admin/services");
  console.log("Attempting to reconnect...");
  provider = new Xdc3.providers.WebsocketProvider(ws_provider);

  provider.on("connect", function() {
    console.log("WSS Reconnected in admin/services");
  });

  provider.on('error', function () {
    console.log("error while reconnecting to WS in admin/services");
    console.log("reconn interval starting...");
    reconnInterval();
  })

  web3.setProvider(provider);
});

setInterval(web3Heartbeat, 10000);

const contractInstance = new web3.eth.Contract(
  config.erc20ABI,
  formatAddress(config.tokenAddress)
);
const gasPriceGwei = 12;

exports.addAdmin = async (req, res) => {
  console.log("called addAdmin");
  try {
    const newAdminEmail = req.body.newAdminEmail;
    if (_.isEmpty(newAdminEmail)) {
      return res.json({
        status: false,
        error: "bad request, empty newAdminEmail"
      });
    }
    const newAdminClient = await client.findOne({
      where: { email: newAdminEmail }
    });
    if (newAdminClient === null) {
      return res.json({
        error: `bad request, client for email ${newAdminEmail} not found `,
        status: false
      });
    }
    if (newAdminClient.acntType === 1) {
      return res.json({
        error: `bad request, ${newAdminEmail} already an admin`,
        status: false
      });
    }
    newAdminClient.acntType = 1;
    await newAdminClient.save();
    res.json({ status: true, message: "new admin added!" });
  } catch (e) {
    console.log("exception at admin.services.addAdmin: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.removeAdmin = async (req, res) => {
  console.log("called removeAdmin");
  try {
    const removeAdminEmail = req.body.removeAdminEmail;
    if (_.isEmpty(removeAdminEmail)) {
      return res.json({
        status: false,
        error: "bad request, empty removeAdminEmail"
      });
    }
    const removeAdminClient = await client.findOne({
      where: { email: removeAdminEmail }
    });
    if (removeAdminClient === null) {
      return res.json({
        error: `bad request, client for email ${removeAdminEmail} not found `,
        status: false
      });
    }
    if (removeAdminClient.acntType === 0) {
      return res.json({
        error: `bad request, ${removeAdminEmail} already not an admin`,
        status: false
      });
    }
    removeAdminClient.acntType = 0;
    await removeAdminClient.save();
    res.json({ status: true, message: "admin removed!" });
  } catch (e) {
    console.log("exception at admin.services.removeAdmin: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.blacklistUser = async (req, res) => {
  console.log("called blacklistUser");
  try {
    const userEmail = req.body.userEmail;
    if (_.isEmpty(userEmail)) {
      return res.json({ status: false, error: "bad request, userEmail empty" });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        status: false,
        error: `bad request, cannot find client for email ${userEmail} `
      });
    }
    if (userClient.blacklisted === true) {
      return res.json({
        status: false,
        error: `bad request, user ${userEmail} already blacklisted`
      });
    }
    userClient.blacklisted = true;
    await userClient.save();
    res.json({ status: true, message: `blacklisted user ${userEmail}` });
  } catch (e) {
    console.log("exception at admin.services.blacklistUser: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.whitelistUser = async (req, res) => {
  console.log("called whitelistUser");
  try {
    const userEmail = req.body.userEmail;
    if (_.isEmpty(userEmail)) {
      return res.json({ status: false, error: "bad request, userEmail empty" });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        status: false,
        error: `bad request, cannot find client for email ${userEmail} `
      });
    }
    if (userClient.blacklisted === false || userClient.blacklisted === null) {
      return res.json({
        status: false,
        error: `bad request, user ${userEmail} is not blacklisted`
      });
    }
    userClient.blacklisted = false;
    await userClient.save();
    res.json({ status: true, message: `whitelisted user ${userEmail}` });
  } catch (e) {
    console.log("exception at admin.services.whitelistUser: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.addPackage = async (req, res) => {
  console.log("called addPackage");
  try {
    const userEmail = req.body.userEmail;
    const packageCnt = req.body.packageCnt;
    if (_.isEmpty(userEmail) || _.isEmpty(packageCnt)) {
      return res.json({
        status: false,
        error: "bad request, missing parameters"
      });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        status: false,
        error: `bad request, cannot find client for email ${userEmail} `
      });
    }
    const packCnt = parseInt(packageCnt);
    userClient.package1 += packCnt;
    await userClient.save();
    res.json({
      status: true,
      message: `added ${packCnt} packages to user ${userEmail}`
    });
  } catch (e) {
    console.log("exception at admin.services.addPackage: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.removePackage = async (req, res) => {
  console.log("called removePackage");
  try {
    const userEmail = req.body.userEmail;
    const packageCnt = req.body.packageCnt;
    if (_.isEmpty(userEmail) || _.isEmpty(packageCnt)) {
      return res.json({
        status: false,
        error: "bad request, missing parameters"
      });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        status: false,
        error: `bad request, cannot find client for email ${userEmail} `
      });
    }
    let packCnt = parseInt(packageCnt);
    if (userClient.package1 < packCnt) {
      packCnt = userClient.package1;
      userClient.package1 = 0;
    } else {
      userClient.package1 -= packCnt;
    }
    await userClient.save();
    res.json({
      status: true,
      message: `removed ${packCnt} packages to user ${userEmail}`
    });
  } catch (e) {
    console.log("exception at admin.services.removePackage: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.userTokenTopUp = async (req, res) => {
  console.log("called userTokenTopUp");
  try {
    const userEmail = req.body.userEmail;
    const tokenAmount = req.body.tokenAmount;
    if (_.isEmpty(userEmail) || _.isEmpty(tokenAmount)) {
      return res.json({
        status: false,
        error: "bad request, missing parameter(s)"
      });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        error: `bad request, client not found for user ${userEmail}`
      });
    }
    const userAddr = await userCurrAddr.findOne({
      where: {
        [Op.and]: [
          { client_id: userClient.uniqueId },
          { currencyType: "masterEthereum" }
        ]
      }
    });

    if (userAddr === null) {
      return res.json({
        error: `internal error, user-currency not found for ${userEmail}}]`
      });
    }

    sendToUser(userAddr.address, tokenAmount)
      .then(hash => {
        console.log("got the eceipt at userTokenTopUp");
        res.json({ status: true, message: "transfer initiated", hash: hash });
      })
      .catch(err0 => {
        console.error("error at admiin.services.userTokenTopUp: ", err0);
        res.json({ status: false, error: "internal error" });
      });
  } catch (e) {
    console.log("exception at userTokenTopUp: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.userEthTopUp = async (req, res) => {
  console.log("called userEthTopUp");
  try {
    const userEmail = req.body.userEmail;
    const ethAmount = req.body.ethAmount;
    if (_.isEmpty(userEmail) || _.isEmpty(ethAmount)) {
      return res.json({
        status: false,
        error: "bad request, missing parameter(s)"
      });
    }
    const userClient = await client.findOne({ where: { email: userEmail } });
    if (userClient === null) {
      return res.json({
        error: `bad request, client not found for user ${userEmail}`
      });
    }
    const userAddr = await userCurrAddr.findOne({
      where: {
        [Op.and]: [
          { client_id: userClient.uniqueId },
          { currencyType: "masterEthereum" }
        ]
      }
    });

    if (userAddr === null) {
      return res.json({
        error: `internal error, user-currency not found for ${userEmail}}]`
      });
    }

    sendEthToUser(userAddr.address, ethAmount)
      .then(hash => {
        console.log("got the hash at userEthTopUp: ", hash);
        res.json({ hash: hash, message: "transfer initiated", status: true });
      })
      .catch(err0 => {
        console.log("exception at admin.services.userEthTopUp: ", err0);
        res.json({ status: false, error: "internal error" });
      });
  } catch (e) {
    console.log("exception at admin.services.userEthTopUp: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllClient = async (req, res) => {
  console.log("called getAllClient");
  try {
    const retLogs = [];
    const ignoreKeys = [
      "kyc_verified",
      "kycDocName1",
      "kycDocName2",
      "kycDocName3",
      "kycDoc1",
      "kycDoc2",
      "kycDoc3",
      "mobile",
      "isd_code",
      "github_id",
      "facebook_id",
      "google_id",
      "password"
    ];
    const allLogs = await client.findAll({}, { raw: true });
    allLogs.forEach(currLog => {
      ignoreKeys.forEach(fieldName => {
        delete currLog.dataValues[fieldName];
      });
      retLogs.push(currLog);
    });
    res.json({ status: true, logs: retLogs });
  } catch (e) {
    console.log("exception at admin.services.getAllClient: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllProjectConfiguration = async (req, res) => {
  console.log("called getAllProjectConfiguration");
  try {
    const ignoreKeys = [
      "tokenABICode",
      "tokenContractCode",
      "tokenByteCode",
      "crowdsaleABICode",
      "crowdsaleContractCode",
      "crowdsaleByteCode"
    ];
    const retLogs = [];
    const allLogs = await projectConfiguration.findAll({}, { raw: true });
    allLogs.forEach(currLog => {
      ignoreKeys.forEach(currkey => {
        delete currLog.dataValues[currkey];
      });
      retLogs.push(currLog);
    });
    res.json({ status: true, logs: retLogs });
  } catch (e) {
    console.log("exception at admin.services.getAllProjectConfiguration: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllReferralLog = async (req, res) => {
  console.log("called getAllReferralLog");
  try {
    const allLogs = await referralLogs.findAll({}, { raw: true });
    res.json({ status: true, logs: allLogs });
  } catch (e) {
    console.log("exception at admin.services.getAllReferralLog");
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllUserCurrencyAddress = async (req, res) => {
  try {
    const allLogs = await userCurrAddr.findAll({}, { raw: true });
    const ignoreKeys = ["privateKey"];
    const retLogs = [];
    allLogs.forEach(currLog => {
      ignoreKeys.forEach(fieldName => {
        delete currLog.dataValues[fieldName];
      });
      retLogs.push(currLog);
    });
    res.json({ status: true, logs: retLogs });
  } catch (e) {
    console.log("exception at admin.services.userCurrencyAddress: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

/*

  3 types of transfer logs
  Send them as it is

*/

exports.getAllTransferRollout = async (req, res) => {
  console.log("called getAllTransferRollout");
  try {
    const allLogs = await tokenTransferRollout.findAll({}, { raw: true });
    return res.json({ status: true, logs: allLogs });
  } catch (e) {
    console.log("exception at admin.services.getAllTransferRollout: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllTransferBuyPackage = async (req, res) => {
  console.log("called getAllTransferBuyPackage");
  try {
    const allLogs = await tokentransferBuyPackage.findAll({}, { raw: true });
    return res.json({ status: true, logs: allLogs });
  } catch (e) {
    console.log("exception at admin.services.getAlltransferBuyPackage: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.getAllTransferTokenBuy = async (req, res) => {
  console.log("called getAllTransferTokenBuy");
  try {
    const allLogs = await tokenTransferTokenBuy.findAll({}, { raw: true });
    return res.json({ status: true, logs: allLogs });
  } catch (e) {
    console.log("exception at admin.services.getAlltransferToeknBuy: ", e);
    return res.json({ status: false, error: "internal error" });
  }
};

/**
 * sendToUser will send tokens from the Admin's Token Wallet to the address specified
 * @param {string} recipient address to which the tokens needs to be sent
 * @param {string} amount referral / referred amount
 */
function sendToUser(recipient, amount) {
  return new Promise(async(resolve, reject) => {
    const currConfig = await siteConfig.findOne({});    
    console.log(currConfig.dataValues.diversionAddress);    
    const transaction = {
      from: formatAddress(currConfig.dataValues.diversionAddress),
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9+""),
      to: formatAddress(config.tokenAddress),
      value: "0x0",
      data: contractInstance.methods
        .transfer(recipient, amount + "")
        .encodeABI()
    };
    web3.eth.estimateGas(transaction).then(gasLimit => {
      transaction["gasLimit"] = gasLimit;
      web3.eth.accounts
        .signTransaction(transaction, currConfig.dataValues.diversionPrivKey)
        .then(result => {
          web3.eth
            .sendSignedTransaction(result.rawTransaction)
            .once("transactionHash", hash => resolve(hash))
            .on("receipt", receipt => {
              console.log("got the receipt in userTokenTopUp: ", receipt);
            });
        });
    });
  });
}

function sendEthToUser(address, amount) {
  return new Promise(async (resolve, reject) => {
    const currConfig = await siteConfig.findOne();
    const tx = {
      from: formatAddress(currConfig.dataValues.xinfinAddress),
      to: formatAddress(address),
      value: amount
    };
    web3.eth.estimateGas(tx).then(gasLimit => {
      tx["gasLimit"] = gasLimit;
      web3.eth.accounts
        .signTransaction(tx, currConfig.dataValues.xinfinPrivKey)
        .then(result => {
          web3.eth
            .sendSignedTransaction(result.rawTransaction)
            .once("transactionHash", hash => resolve(hash))
            .on("receipt", receipt => {
              console.log("got the receipt in userEthTopUp: ", receipt);
            });
        });
    });
  });
}

exports.getProjectConfig = async (req, res) => {
  try {
    const {
      tokenAddress,
      ws_provider,
      erc20ABI
    } = config;
    const currSiteConfig = await siteConfig.findOne();
    res.json({
      status: true,
      config: {
        diversionAddress: currSiteConfig.dataValues.diversionAddress,
        ethTopUpAddr: currSiteConfig.dataValues.xinfinAddress,
        tokenAddress: tokenAddress,
        ws_provider: ws_provider,
        erc20ABI: erc20ABI,
        packagePrice: currSiteConfig.dataValues.packagePrice
      }
    });
  } catch (e) {
    console.log("exception at admin.services.getProjectConfig: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.changePackagePrice = async (req, res) => {
  console.log("called changePackagePrice");
  try {
    const currConfig = await siteConfig.findOne();
    const newPackPrice = req.body.packagePrice;
    if (_.isEmpty(newPackPrice)) {
      return res.json({ status: false, error: "bad request" });
    }
    currConfig.packagePrice = newPackPrice;
    await currConfig.save();
    res.json({ status: true, message: "package price changed." });
  } catch (e) {
    console.log("exception at changePackagePrice: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.changeNetworkKey = async (req, res) => {
  console.log("called changeNetworkKey");
  try {
    const currConfig = await siteConfig.findOne();
    const networkName = req.body.networkName;
    let privKey = req.body.privKey;
    if (_.isEmpty(networkName) || _.isEmpty(privKey)) {
      return res.json({
        status: false,
        error: "bad request; missing paramter(s)"
      });
    }

    if (!privKey.startsWith("0x")) {
      privKey = "0x" + privKey;
    }

    if (privKey.length!==66){
      return res.json({
        status: false,
        error: "bad request; invalid private key"
      });
    }

    const fields = getDbField(networkName);
    if (fields === null) {
      return res.json({
        status: false,
        error: "bad request; network not found"
      });
    }

    const keyAddr = web3.eth.accounts.privateKeyToAccount(privKey);
    if (keyAddr === null) {
      return res.json({ status: false, error: "bad request; bad private key" });
    }
    console.log("address: ", keyAddr)
    currConfig[fields[0]] = keyAddr.address;
    currConfig[fields[1]] = privKey;
    if (!currConfig["allKeys"]) {
      currConfig["allKeys"] = [];
    }

    if (!currConfig["allKeys"].includes(privKey)){
      currConfig["allKeys"].push(privKey);
      currConfig.changed('allKeys',true);
    }

    await currConfig.save();
    res.json({ status: true, message: "network key added" });
  } catch (e) {
    console.log("exception at changePackagePrice: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

exports.changeDiversionKey = async (req, res) => {
  console.log("called changeDiversionKey");
  try {
    const currConfig = await siteConfig.findOne();
    let privKey = req.body.privKey;
    if ( _.isEmpty(privKey)) {
      return res.json({
        status: false,
        error: "bad request; missing paramter"
      });
    }

    if (!privKey.startsWith("0x")) {
      privKey = "0x" + privKey;
    }

    if (privKey.length!==66){
      return res.json({
        status: false,
        error: "bad request; invalid private key"
      });
    }

    const keyAddr = web3.eth.accounts.privateKeyToAccount(privKey);
    if (keyAddr === null) {
      return res.json({ status: false, error: "bad request; bad private key" });
    }
    console.log(keyAddr);
    currConfig.diversionAddress=keyAddr.address;
    currConfig.diversionPrivKey=privKey;

    await currConfig.save();
    res.json({ status: true, message: "diversion key chnaged" });
  } catch (e) {
    console.log("exception at changeDiversionKey: ", e);
    res.json({ status: false, error: "internal error" });
  }
};

function getDbField(networkName) {
  switch (networkName) {
    case "apothem": {
      return ["apothemAddress", "apothemPrivKey"];
    }
    case "rinkeby": {
      return ["rinkebyAddress", "rinkebyPrivKey"];
    }
    case "xinfin": {
      return ["xinfinAddress", "xinfinPrivKey"];
    }
    default: {
      return null;
    }
  }
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
    const isListening = await web3.eth.net.isListening();
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
    console.log("retrying web3 connection in in admin/services...");
    provider = new Xdc3.providers.WebsocketProvider(ws_provider);
    web3.setProvider(provider);

    provider.on("connect", () => {
      console.log("WS reconnected in in admin/services");
      clearInterval(reconnInt);
      reconnActive = false;
    });
  }, 30000);
}