import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";
import {connect} from "react-redux";

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";
import * as actions from "../../../actions";

class PackagePrice extends Component {
  constructor(props) {
    super(props);
    this.state = { packagePrice: "" };

    this.handlePackagePriceChange = this.handlePackagePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePackagePriceChange(event) {
    this.setState({ packagePrice: event.target.value });
  }

  handleSubmit() {
    const packagePriceValid = validate("integer", this.state.packagePrice);

    if (!packagePriceValid) {
      return showNotification(
        "danger",
        "Package Price",
        "Invalid package price"
      );
    }
    // data is valid
    axios
      .post("/api/changePackagePrice", {
        packagePrice: this.state.packagePrice
      })
      .then(resp => {
        if (resp.data.status === true) {
          // all good
          // show success image, on confirm empty state.
          this.setState({
            showSuccess: true,
            successMsg: `Package Price set to ${this.state.packagePrice}!`,
            packagePrice: ""
          });

          this.props.fetchProjectConfig();
        } else {
          // show error
          this.setState({
            showError: true,
            errorMsg: resp.data.error
          });
        }
      })
      .catch(err => {
        //  err.response.data.error
        console.log(err);
        console.log(err.response.data);
        this.setState({
          showError: true,
          errorMsg: err.response.data.error
        });
      });
  }

  render() {
    return (
      <div className="card">
        <div className="header">
          <h4>Change Package Price</h4>
        </div>
        <div className="content">
          <form className="form-horizontal soft-input">
            <div className="form-group">
              <label className="col-md-3 control-label">
                New Package Price
              </label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.packagePrice}
                  onChange={this.handlePackagePriceChange}
                  placeholder="package price"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-3 control-label">
                Current Package Price
              </label>
              <div className="col-md-9">
                <input
                  type="text"
                  disabled
                  value={
                    this.props.config
                      ? this.props.config.config.packagePrice
                      : "loading"
                  }
                  onChange={this.handlePackagePriceChange}
                  placeholder="package price"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-3"></label>
              <div className="col-md-9">
                <button
                  type="button"
                  onClick={this.handleSubmit}
                  className="right btn btn-fill btn-info"
                >
                  Change
                </button>
              </div>
            </div>
          </form>
          <Alert
            title="Success"
            show={this.state.showSuccess}
            text={this.state.successMsg}
            type="success"
            onConfirm={() =>
              this.setState({ showSuccess: false, successMsg: "success" })
            }
          />
          <Alert
            title="Error"
            show={this.state.showError}
            text={this.state.errorMsg}
            type="error"
            onConfirm={() =>
              this.setState({ showError: false, errorMsg: "error" })
            }
          />
        </div>
      </div>
    );
  }
}

function showNotification(type, title, message) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    width: 200,
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
}

function mapsStateToProps({config}){
  return {config}
}

export default connect(mapsStateToProps, actions)(PackagePrice);
