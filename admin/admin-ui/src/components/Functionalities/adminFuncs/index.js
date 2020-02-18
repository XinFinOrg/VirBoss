import React, { Component } from "react";

import AddAdmin from "./AddAdmin";
import RemoveAdmin from "./RemoveAdmin";
import PackagePrice from "./PackagePrice";
import ChangeNetworkKey from "./ChangeNetworkKey";
import ChangeDiversion from "./ChangeDiversion";

class AdminFuncs extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <AddAdmin />
          </div>
          <div className="col-md-6">
            <RemoveAdmin />
          </div>
          <div className="col-md-6">
            <PackagePrice />
          </div>
          <div className="col-md-6">
            <ChangeNetworkKey />
          </div>
          <div className="col-md-6">
            <ChangeDiversion />
          </div>
        </div>
      </div>
    );
  }
}

export default AdminFuncs;
