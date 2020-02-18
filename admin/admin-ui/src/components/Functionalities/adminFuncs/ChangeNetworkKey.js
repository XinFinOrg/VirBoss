import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";

class ChangeNetworkKey extends Component {
  constructor(props) {
    super(props);
    this.state = { newPrivKey: "", networkName: "" };

    this.handlePrivKeyChange = this.handlePrivKeyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePrivKeyChange(event) {
    this.setState({ newPrivKey: event.target.value });
  }

  handleSubmit() {
    const privKeyValid = validate("privateKey", this.state.newPrivKey);
    const networkName = document.getElementById("networkName").value;
    if (!networkName){
      return showNotification("danger","Change Network Key", "Please select a network!")
    }
    if (!privKeyValid) {
      return showNotification(
        "danger",
        "Change Private Key",
        "Invalid private key"
      );
    }
    // data is valid
    axios
      .post("/api/changeNetworkKey", {
        privKey: this.state.newPrivKey,
        networkName: networkName
      })
      .then(resp => {
        console.log("response: ", resp)
        if (resp.data.status === true) {
          // all good
          // show success image, on confirm empty state.
          this.setState({
            showSuccess: true,
            successMsg: `Private key Changed!`,
            newPrivKey: ""
          });
          document.getElementById("networkName").value="";
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
          <h4>Change Network Key</h4>
        </div>
        <div className="content">
          <form className="form-horizontal soft-input">
            <div className="form-group">
              <label className="col-md-3 control-label">Network</label>
              <div className="col-md-9">
                <select id="networkName">
                  <option value="rinkeby">Rinkeby Testnet</option>
                  <option selected="true" value="xinfin">Xinfin Mainnet</option>
                  <option value="apothem">Apothem Testnet</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-3 control-label">Private Key</label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.newPrivKey}
                  onChange={this.handlePrivKeyChange}
                  placeholder="private key"
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

export default ChangeNetworkKey;
