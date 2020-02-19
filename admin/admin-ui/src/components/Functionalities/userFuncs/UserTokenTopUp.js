import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";

const MySwal = withReactContent(Swal);

class UserTokenTopUp extends Component {
  constructor(props) {
    super(props);
    this.state = { userEmail: "", tokenAmount: null };

    this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
    this.handleTokenAmountChange = this.handleTokenAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  handleTokenAmountChange(event) {
    this.setState({ tokenAmount: event.target.value });
  }

  handleSubmit() {
    const emailValid = validate("email", this.state.userEmail);
    const tokenAmountValid = validate("integer", this.state.tokenAmount);
    if (!emailValid) {
      return showNotification("danger", "Token Top-up", "Invalid email");
    } else if (!tokenAmountValid) {
      return showNotification("danger", "Token Top-up", "Invalid token amount");
    }
    if (parseInt(this.state.tokenAmount, 10) <= 0) {
      return showNotification("danger", "Token Top-up", "Invalid token amount");
    }
    // data is valid
    axios
      .post("/api/userTokenTopUp", {
        userEmail: this.state.userEmail,
        tokenAmount: this.state.tokenAmount
      })
      .then(async resp => {
        if (resp.data.status === true) {
          // all good
          // show success image, on confirm empty state.
          await MySwal.fire({title:"Success!",icon:'success',  showCloseButton: true,  footer: `<a target="_blank" style="text-decoration:underline;color:blue;" href="https://explorer.xinfin.network/tx/${resp.data.hash}">View on XinFin Explorer</a>`,html:`${resp.data.message}<br><strong>Tx Hash</strong><div style="overflow:auto">${resp.data.hash}</div>`});
          this.setState({userEmail:"",tokenAmount:""});
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
          <h4>Token Top-Up</h4>
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
              <label className="col-md-3 control-label">Token Amount</label>
              <div className="col-md-9">
                <input
                  type="text"
                  value={this.state.tokenAmount}
                  onChange={this.handleTokenAmountChange}
                  placeholder="token amount ( wei equivalent )"
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
                  Credit
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

export default UserTokenTopUp;
