import axios from "axios";
import {
  FETCH_USER,
  FETCH_ALL_USER,
  FETCH_ALL_PROJECT,
  FETCH_ALL_REFERRAL_LOG,
  FETCH_ALL_USER_CURRENCY,
  FETCH_TOKEN_TRANSFER_ROLLOUT,
  FETCH_TOKEN_TRANSFER_TOKEN_BUY,
  FETCH_TOKEN_TRANSFER_BUY_PACK,
  FETCH_PROJECT_CONFIG
} from "./types";

/*

  Current Timestamp has been appended to the res.data as res.fetchedTS.
  This will represent last-updated-time of the data on a given chart/table/log

*/

export const fetchUser = () => async dispatch => {
  console.log("called Fetch User");
  const res = await axios.get("/api/currentUser", { withCredentials: true });
  console.log("response from server", res);
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchAllUser = () => async dispatch => {
  console.log("called fetch all user");
  const res = await axios.get("/api/getAllClient");
  console.log("response from server: ", res);
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_ALL_USER, payload: res.data });
};

export const fetchAllProject = () => async dispatch => {
  console.log("called fetchAllProject");
  const res = await axios.get("/api/getAllProjectConfiguration");
  console.log("response from server: ", res);
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_ALL_PROJECT, payload: res.data });
};

export const fetchAllUserCurrency = () => async dispatch => {
  console.log("called fetchAllUserCurrency");
  const res = await axios.get("/api/getAllUserCurrencyAddress");
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_ALL_USER_CURRENCY, payload: res.data });
};

export const fetchAllReferralLog = () => async dispatch => {
  console.log("called fetchAllReferralLog");
  const res = await axios.get("/api/getAllReferralLog");
  console.log("response from server: ", res);
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_ALL_REFERRAL_LOG, payload: res.data });
};

export const fetchTokenTransferRollout = () => async dispatch => {
  console.log("called fetchTokenTransferRollout");
  const res = await axios.get("/api/getAllTransferRollout");
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_TOKEN_TRANSFER_ROLLOUT, payload: res.data });
};

export const fetchTokenTransferTokenBuy = () => async dispatch => {
  console.log("called fetchTokenTransferTokenBuy");
  const res = await axios.get("/api/getAllTransferTokenBuy");
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_TOKEN_TRANSFER_TOKEN_BUY, payload: res.data });
};

export const fetchTokenTransferBuyPack = () => async dispatch => {
  console.log("called fetchTokenTransferTokenBuy");
  const res = await axios.get("/api/getAllTransferBuyPackage");
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_TOKEN_TRANSFER_BUY_PACK, payload: res.data });
};

export const fetchProjectConfig = () => async dispatch => {
  console.log("called fetchProjectConfig");
  const res = await axios.get("/api/getProjectConfig");
  res.data["fetchedTS"] = Date.now();
  dispatch({ type: FETCH_PROJECT_CONFIG, payload: res.data });
};
