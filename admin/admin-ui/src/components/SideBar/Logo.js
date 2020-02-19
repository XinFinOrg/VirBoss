import React, { Component } from "react";

class Logo extends Component {
  render() {
    return (
      <div className="brand">
        <div className="logo-wrapper">
          <a href="/">
            <img
              src={require("../../assets/images/logo-light-icon.png")}
              className="logo"
              alt="logo"
            />
          </a>
          ADMIN
        </div>
        <div className="adminTag">ADMIN</div>
      </div>
    );
  }
}

export default Logo;
