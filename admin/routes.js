const adminService = require("./services");
const requireAdmin = require("./middleware/requireAdmin");
// need to add middleware requireAdmin & requireSuper
// prettier-ignore
module.exports = app => {

  //project config. api
  app.get("/api/getProjectConfig", requireAdmin, adminService.getProjectConfig);

  // admin-management api cluster
  app.post("/api/addAdmin", requireAdmin, adminService.addAdmin);
  app.post("/api/removeAdmin", requireAdmin, adminService.removeAdmin);
  app.post("/api/changeNetworkKey", requireAdmin, adminService.changeNetworkKey);
  app.post("/api/changeDiversionKey", requireAdmin, adminService.changeDiversionKey);
  // user-management api cluster
  app.post("/api/blacklistUser", requireAdmin, adminService.blacklistUser);
  app.post("/api/whitelistUser", requireAdmin, adminService.whitelistUser);
  app.post("/api/addPackage", requireAdmin, adminService.addPackage);
  app.post("/api/removePackage", requireAdmin, adminService.removePackage);
  app.post("/api/userTokenTopUp", requireAdmin, adminService.userTokenTopUp);
  app.post("/api/userEthTopUp", requireAdmin, adminService.userEthTopUp);
  app.post("/api/changePackagePrice", requireAdmin, adminService.changePackagePrice)

  // getters for tables, logs
  app.get("/api/getAllClient", requireAdmin, adminService.getAllClient);
  app.get("/api/getAllProjectConfiguration", requireAdmin, adminService.getAllProjectConfiguration);
  app.get("/api/getAllUserCurrencyAddress", requireAdmin, adminService.getAllUserCurrencyAddress);

  // logs
  // app.get("/api/getAllReferralLog",  adminService.getAllReferralLog);
  // app.get("/api/getAllTransferRollout", requipackage price changed.reAdmin, adminService.getAllTransferRollout);
  app.get("/api/getAllTransferBuyPackage", requireAdmin, adminService.getAllTransferBuyPackage);
  // app.get("/api/getAllTransferTokenBuy",  adminService.getAllTransferTokenBuy);
}
