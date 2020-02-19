// import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import ThemeOptions from "./ThemeOptions";
import Layout from "./Layout";
import Auth from "./Auth";
import Users from "./Users";
import UserCurrency from "./UserCurrency";
import Project from "./Project";
// import ReferralLog from "./ReferralLog";
import TokenTranferBuyPack from "./TokenTransferBuyPack";
// import TokenTransferRollout from "./TokenTransferRollout";
// import TokenTransferTokenBuy from "./TokenTransferTokenBuy";
import ProjectConfig from "./ProjectConfig";

export default {
  auth: Auth,
  ThemeOptions,
  Layout,
  form: formReducer,
  users: Users,
  userCurrency: UserCurrency,
  project: Project,
  // referralLog: ReferralLog,
  tokenTransferBuyPack: TokenTranferBuyPack,
  // tokenTransferRollout: TokenTransferRollout,
  // tokenTransferTokenBuy: TokenTransferTokenBuy,
  config: ProjectConfig
};
