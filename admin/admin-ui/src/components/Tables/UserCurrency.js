import React, { Component } from "react";
import { connect } from "react-redux";
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import * as actions from "../../actions";

import paginationFactory from "react-bootstrap-table2-paginator";

import filterFactory, {
  textFilter,
  dateFilter,
  numberFilter,
  selectFilter
} from "react-bootstrap-table2-filter";

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

const acntTypsOpts = {
  "0": 0,
  "1": 1
};

const booleanOpts = {
  true: "true",
  false: "false"
};

function createdPostFilter(filterVal, data) {
  if (filterVal.date != null && filterVal.comparator !== "") {
    return data.filter(row => {
      if (!isNaN(Date.parse(row.created)) && Date.parse(row.created) > 0) {
        return evaluateDateExpression(
          row.created,
          filterVal.date,
          filterVal.comparator
        );
      }
      return false;
    });
  }
  return data;
}

function lastActivePostFilter(filterVal, data) {
  if (filterVal.date != null && filterVal.comparator !== "") {
    return data.filter(row => {
      if (
        !isNaN(Date.parse(row.lastActive)) &&
        Date.parse(row.lastActive) > 0
      ) {
        return evaluateDateExpression(
          row.lastActive,
          filterVal.date,
          filterVal.comparator
        );
      }
      return false;
    });
  }
  return data;
}

function defHeadFormatter(column, colIndex, { sortElement, filterElement }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minWidth: "250px",
      textAlign: "center"
    }}>
      <div>{filterElement}</div>
      <div>
        {column.text}
        {sortElement}
      </div>
    </div>
  );
}

const columns = [
  {
    dataField: "srNo",
    text: "Sr.No",
    sort: true
  },
  {
    dataField: "uniqueId",
    text: "ID",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "client_id",
    text: "User ID",
    filter: textFilter(),
    sort: true,
    headerFormatter: defHeadFormatter

  },
  {
    dataField: "currencyType",
    text: "Currency Type",
    filter: textFilter(),
    sort: true,
    headerFormatter: defHeadFormatter

  },
  {
    dataField: "address",
    text: "Address",
    filter: numberFilter(),
    headerFormatter: defHeadFormatter

  },
  {
    dataField: "project_id",
    text: "Project ID",
    filter: textFilter(),
    sort: true,
        headerFormatter: defHeadFormatter

  },
  {
    dataField: "created",
    text: "Created",
    filter: dateFilter({
      onFilter: createdPostFilter
    }),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "lastActive",
    text: "Updated",
    filter: dateFilter({
      onFilter: lastActivePostFilter
    }),
    headerFormatter: defHeadFormatter
  }
];

class UserCurrency extends Component {
  // to load the current count
  componentDidMount() {
    if (this.props.userCurrency) this.filterUserData();
    else {
      this.props.fetchAllUserCurrency();
    }
  }

  paginationOption = () => {
    return {
      custom: true,
      totalSize: this.props.userCurrency.logs.length
    };
  };

  handleDataChange = data => {
    document.getElementById("currDataCount").innerHTML = data.dataSize;
  };

  filterUserData() {
    console.log("called filter user data");
    const addressData = this.props.userCurrency.logs;
    // SR. no, Name, Email ID, Certificate Count, Created, Last Used
    let srNo = 1;
    const retData = [];
    addressData.forEach(address => {
      retData.push({
        srNo: srNo++,
        uniqueId: address.uniqueId,
        client_id: address.client_id,
        currencyType: address.currencyType,
        address: address.address,
        project_id: address.project_id,
        created: address.createdAt,
        lastActive: address.updatedAt
      });
    });
    console.log("FILTERED DATA::");
    console.log(retData);
    if (document.getElementById("currDataCount"))
      document.getElementById("currDataCount").innerHTML = retData.length;
    return retData;
  }

  render() {
    return (
      <div className="table-container">
        <div className="row">
          <div className="col-md-12">
            <div className="header">
              <div className="row">
                <div className="col-md-6">
                  <h4>
                    User Currency Table{" "}
                    <span
                      onClick={() => {
                        this.props.fetchAllUserCurrency();
                      }}
                      className="table-refresh-btn"
                    >
                      <i class="fa fa-refresh" aria-hidden="true"></i>
                    </span>
                  </h4>
                  <p>Table with all UserCurrency</p>
                </div>
                <div className="col-md-6">
                  <div
                    id="currRowCount"
                    className="right table-row-count-wrapper"
                  >
                    <span>
                      <span className="table-row-count-label">
                        Current Row Count&nbsp;
                        <i class="fa fa-arrow-right"></i>
                        &nbsp;
                      </span>
                      <span id="currDataCount" className="table-row-count">
                        {" "}
                        <i
                          className="fa fa-cogs"
                          style={{ color: "black" }}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <br />
                    {this.props.userCurrency ? (
                      <div className="table-updated right">
                        <i className="fa fa-history"></i> Updated at{" "}
                        <strong>
                          {new Date(
                            this.props.userCurrency.fetchedTS
                          ).getHours() +
                            ":" +
                            new Date(
                              this.props.userCurrency.fetchedTS
                            ).getMinutes()}
                        </strong>{" "}
                        Hours
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {this.props.userCurrency ? (
                <div className="bootstrap-table-wrapper font-small">
                  <BootstrapTable
                    keyField="srNo"
                    data={this.filterUserData()}
                    columns={columns}
                    filter={filterFactory()}
                    pagination={paginationFactory({
                      hideSizePerPage: true
                    })}
                    onDataSizeChange={this.handleDataChange}
                  />
                </div>
              ) : (
                <div className="chart-preload">
                  <div>
                    <i className="fa fa-cogs fa-5x" aria-hidden="true" />
                  </div>
                  Loading
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapsStateToProps({ userCurrency }) {
  return { userCurrency };
}

function evaluateDateExpression(a, b, comparator) {
  const a_date = new Date(a);
  const b_date = new Date(b);
  a_date.setHours(0, 0, 0, 0);
  b_date.setHours(0, 0, 0, 0);
  switch (comparator) {
    case "=": {
      if (
        a_date.getDate() === b_date.getDate() &&
        a_date.getMonth() === b_date.getMonth() &&
        a_date.getFullYear() === b_date.getFullYear()
      ) {
        return true;
      }
      return false;
    }
    case ">=": {
      if (a_date.getTime() >= b_date.getTime()) {
        return true;
      }
      return false;
    }
    case "<=": {
      if (a_date.getTime() <= b_date.getTime()) {
        return true;
      }
      return false;
    }
    case ">": {
      if (a_date.getTime() > b_date.getTime()) {
        return true;
      }
      return false;
    }
    case "<": {
      if (a_date.getTime() < b_date.getTime()) {
        return true;
      }
      return false;
    }
    case "": {
      if (a_date === b_date) {
        return true;
      }
      return false;
    }
    default: {
    }
  }
}

export default connect(mapsStateToProps, actions)(UserCurrency);
