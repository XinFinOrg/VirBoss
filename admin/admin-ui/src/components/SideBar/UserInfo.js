import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

class UserInfo extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchAllUser();
    // this.props.fetchAllReferralLog();
    this.props.fetchTokenTransferBuyPack();
    this.props.fetchProjectConfig();
  }

  state = {
    isShowingUserMenu: false
  };

  render() {
    let { auth } = this.props;
    // if (!auth || !auth.status){
    //   window.location.replace("https://www.blockdegree.org");
    // }
    return (
      <div className="user-wrapper">
        <div className="user">
          <div className="userinfo">
            <div className="username">
              {auth
                ? auth.status
                  ? "Welcome, " + auth.email
                  : "Not logged in"
                : "Not logged in"}
            </div>
            <div className="title">Admin</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapsStateToProps({ users, tokenTransferBuyPack, referralLog, config, auth }) {
  return { users, tokenTransferBuyPack, referralLog, config, auth };
}

export default connect(mapsStateToProps, actions)(UserInfo);
