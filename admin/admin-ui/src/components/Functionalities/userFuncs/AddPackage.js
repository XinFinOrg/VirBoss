import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";

class AddPackage extends Component {
  constructor(props) {
    super(props);
    this.state = { userEmail: "", packageCnt: null };

    this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
    this.handlePackageCntChange = this.handlePackageCntChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePackageCntChange(event) {
    this.setState({ packageCnt: event.target.value });
  }

  handleSubmit() {
    const emailValid = validate("email", this.state.userEmail);
    const packageCntValid = validate("integer", this.state.packageCnt);
    if (!emailValid) {
      return showNotification("danger", "Add Package", "Invalid email");
    } else if (!packageCntValid) {
      return showNotification("danger", "Add Package", "Invalid package count");
    }
    if (this.state.packageCnt === null || this.state.packageCnt <= 0) {
      return showNotification("danger", "Add Package", "Invalid package count");
    }
    // data is valid
    axios
      .post("/api/addPackage", {
        userEmail: this.state.userEmail,
        packageCnt: this.state.packageCnt
      })
      .then(resp => {
        if (resp.data.status === true) {
          // all good
          // show success image, on confirm empty state.
          this.setState({
            showSuccess: true,
            successMsg: `${this.state.packageCnt} packages credited to user ${this.state.userEmail}`,
            userEmail: "",
            packageCnt: ""
          });
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
          <h4>Add Package</h4>
        </div>
        <div className="content">
          <form className="form-horizontal soft-input">
            <div className="form-group">
              <label className="col-md-3 control-label">User Email</label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.userEmail}
                  onChange={this.handleUserEmailChange}
                  placeholder="user email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-3 control-label">Package Count</label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.packageCnt}
                  onChange={this.handlePackageCntChange}
                  placeholder="package count"
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
                  Credit Packages
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

export default AddPackage;
