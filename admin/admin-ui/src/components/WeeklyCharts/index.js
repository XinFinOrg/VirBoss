import React, { Component } from "react";
import { connect } from "react-redux";

import PackBought from "./PackBought";
import AccountsCreated from "./AccountCreated";
import AccountActive from "./AccountActive";

class WeeklyStats extends Component {
  renderContent() {
    return (
      <div>
        <div className="content bg-white">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <AccountsCreated />
              </div>
              <div className="col-md-6">
                <AccountActive />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <PackBought />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}

function mapsStateToProps({ users, referralLogs, tokenTransferBuyPack }) {
  return { users, referralLogs, tokenTransferBuyPack };
}

export default connect(mapsStateToProps)(WeeklyStats);
