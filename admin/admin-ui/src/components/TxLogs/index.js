import React from "react";
import { Route } from "react-router-dom";

import TokenTransferBuyPack from "./TokenTransfeBuyPack";

const Logs = ({ match }) => (
  <div className="content">
    <Route
      path={`${match.url}/buy-package-logs`}
      component={TokenTransferBuyPack}
    />
  </div>
);

export default Logs;
