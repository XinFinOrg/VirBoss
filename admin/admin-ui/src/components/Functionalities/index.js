import React from "react";
import { Route } from "react-router-dom";

import AdminFuncs from "./adminFuncs";
import UserFuncs from "./userFuncs";

class Functionalities extends React.Component {
  render() {
    return (
      <div className="content">
        <Route
          path={`${this.props.match.url}/admin-management`}
          component={AdminFuncs}
        />
        <Route
          path={`${this.props.match.url}/user-management`}
          component={UserFuncs}
        />
      </div>
    );
  }
}

export default Functionalities;
