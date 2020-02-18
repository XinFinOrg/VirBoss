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
    <div
      style={{
        display: "flex",                                                                                                                                                                                                                                                                                        
        flexDirection: "column",
        minWidth: "250px",
        textAlign: "center"
      }}
    >
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
    dataField: "coinName",
    text: "Coin Name",
    filter: textFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "coinSymbol",
    text: "Coin Symbol",
    filter: textFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "ETHRate",
    text: "Eth. Rate",
    filter: numberFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "tokenSupply",
    text: "Token Supply",
    filter: numberFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "minimumContribution",
    text: "Min. Contribution",
    filter: numberFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "bonusRate",
    text: "Bonus Rate",
    filter: numberFilter(),
    sort: true,
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "bonusStatus",
    text: "Bonus Status",
    formatter: cell => booleanOpts[cell],
    filter: selectFilter({
      options: booleanOpts
    }),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "isAllowedForICO",
    text: "ICO Allwd.",
    formatter: cell => booleanOpts[cell],
    filter: selectFilter({
      options: booleanOpts
    }),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "networkType",
    text: "Network Type",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "networkURL",
    text: "Network URL",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "tokenContractAddress",
    text: "Token Contract Addr.",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "tokenContractHash",
    text: "Token Contract Hash",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },

  {
    dataField: "crowdsaleContractAddress",
    text: "Crowsale Contract Addr.",
    filter: textFilter(),
    headerFormatter: defHeadFormatter
  },
  {
    dataField: "crowdsaleContractHash",
    text: "Crowdsale Contract Hash",
    filter: textFilter(),
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

class Users extends Component {
  // to load the current count
  componentDidMount() {
    if (this.props.project) this.filterUserData();
    else {
      this.props.fetchAllProject();
    }
  }

  paginationOption = () => {
    return {
      custom: true,
      totalSize: this.props.project.logs.length
    };
  };

  handleDataChange = data => {
    document.getElementById("currDataCount").innerHTML = data.dataSize;
  };

  filterUserData() {
    console.log("called filter user data");
    const projectData = this.props.project.logs;
    // SR. no, Name, Email ID, Certificate Count, Created, Last Used
    let srNo = 1;
    const retData = [];
    projectData.forEach(project => {
      retData.push({
        srNo: srNo++,
        uniqueId: project.uniqueId,
        coinName: project.coinName,
        coinSymbol: project.coinSymbol,
        ETHRate: project.ETHRate,
        tokenSupply: project.tokenSupply,
        minimumContribution: project.minimumContribution,
        bonusRate: project.bonusRate,
        bonusStatus: project.bonusStatus,
        isAllowedForICO: project.isAllowedForICO,
        networkType: project.networkType,
        networkURL: project.networkURL,
        tokenContractAddress: project.tokenContractAddress,
        tokenContractHash: project.tokenContractHash,
        crowdsaleContractAddress: project.crowdsaleContractAddress,
        crowdsaleContractHash: project.crowdsaleContractHash,
        created: project.createdAt,
        lastActive: project.updatedAt
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
                    Projects Table{" "}
                    <span
                      onClick={() => {
                        this.props.fetchAllProject();
                      }}
                      className="table-refresh-btn"
                    >
                      <i class="fa fa-refresh" aria-hidden="true"></i>
                    </span>
                  </h4>
                  <p>Table with all Users</p>
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
                    {this.props.project ? (
                      <div className="table-updated right">
                        <i className="fa fa-history"></i> Updated at{" "}
                        <strong>
                          {new Date(this.props.project.fetchedTS).getHours() +
                            ":" +
                            new Date(this.props.project.fetchedTS).getMinutes()}
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
              {this.props.project ? (
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

function mapsStateToProps({ project }) {
  return { project };
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

export default connect(mapsStateToProps, actions)(Users);
