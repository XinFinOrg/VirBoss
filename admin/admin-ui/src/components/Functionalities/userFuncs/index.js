import React, { Component } from "react";

import AddPackage from "./AddPackage";
import RemovePackage from "./RemovePackage";
import BlacklistUser from "./BlacklistUser";
import WhitelistUser from "./WhitelistUser";
import UserEthTopUp from "./UserEthTopUp";
import UserTokenTopUp from "./UserTokenTopUp";

class WalletConfig extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <AddPackage />
          </div>
          <div className="col-md-6">
            <RemovePackage />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <BlacklistUser />
          </div>
          <div className="col-md-6">
            <WhitelistUser />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <UserEthTopUp />
          </div>
          <div className="col-md-6">
            <UserTokenTopUp />
          </div>
        </div>
      </div>
    );
  }
}

export default WalletConfig;
