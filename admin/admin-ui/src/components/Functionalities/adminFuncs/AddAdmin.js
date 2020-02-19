import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";

class AddAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = { newAdminEmail: "" };

    this.handleNewAdminEmailChange = this.handleNewAdminEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNewAdminEmailChange(event) {
    this.setState({ newAdminEmail: event.target.value });
  }

  handleSubmit() {
    const emailValid = validate("email", this.state.newAdminEmail);

    if (!emailValid) {
      return showNotification("danger", "Add New Admin", "Invalid email");
    }
    // data is valid
    axios
      .post("/api/addAdmin", {
        newAdminEmail: this.state.newAdminEmail
      })
      .then(resp => {
        if (resp.data.status === true) {
          // all good
          // show success image, on confirm empty state.
          this.setState({
            showSuccess: true,
            successMsg: `user ${this.state.newAdminEmail} promoted to admin!`,
            newAdminEmail: ""
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
          <h4>Add New Admin</h4>
        </div>
        <div className="content">
          <form className="form-horizontal soft-input">
            <div className="form-group">
              <label className="col-md-3 control-label">User Email</label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.newAdminEmail}
                  onChange={this.handleNewAdminEmailChange}
                  placeholder="admin email"
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
                  Add Admin
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

export default AddAdmin;
