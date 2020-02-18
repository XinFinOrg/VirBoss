import React from "react";
import { Route } from "react-router-dom";

import Users from "./Users";
import UserProjects from "./UserProjects";
import UserCurrency from "./UserCurrency";

const Tables = ({ match }) => (
  <div className="content">
    <Route path={`${match.url}/users`} component={Users} />
    <Route path={`${match.url}/projects`} component={UserProjects} />
    <Route path={`${match.url}/addresses`} component={UserCurrency} />
  </div>
);

export default Tables;
