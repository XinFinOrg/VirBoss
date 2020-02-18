import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";

// prettier-ignore
class Nav extends Component {

  state = {};

  render() {
    let { location } = this.props;
    return (
      <ul className="nav nav-sidebar">

        <li className={location.pathname === '/' ? 'active' : null}>
          <Link to="/">
            <i className="pe-7s-display1"></i>
            <p>Dashboard</p>
          </Link>
        </li>

        <li className={location.pathname === '/weekly-stats' ? 'active' : null}>
          <Link to="/weekly-stats">
            <i className="pe-7s-graph1"></i>
            <p>Weekly Statistics</p>
          </Link>
        </li>

        <li className={this.isPathActive('/tables') || this.state.tablesMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ tablesMenuOpen: !this.state.tablesMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-server"></i>
            <p>Tables <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.tablesMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/tables/users') ? 'active' : null}>
                  <Link to="/tables/users">User Table</Link>
                </li>                
              </ul>

              <ul className="nav">
                <li className={this.isPathActive('/tables/projects') ? 'active' : null}>
                  <Link to="/tables/projects">Project Table</Link>
                </li>                
              </ul>

              <ul className="nav">
                <li className={this.isPathActive('/tables/addresses') ? 'active' : null}>
                  <Link to="/tables/addresses">User Addresses</Link>
                </li>                
              </ul>              
            </div>
          </Collapse>
        </li>



        <li className={this.isPathActive('/functionalities') || this.state.functionalitiesMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ functionalitiesMenuOpen: !this.state.functionalitiesMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-tools"></i>
            <p>Functionalities <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.functionalitiesMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/functionalities/admin-management') ? 'active' : null}>
                  <Link to="/functionalities/admin-management">Admin Management</Link>
                </li>
                              
              </ul>   

              <ul className="nav">
              <li className={this.isPathActive('/functionalities/user-management') ? 'active' : null}>
                  <Link to="/functionalities/user-management">User Management</Link>
                </li>  
              </ul>                       
            </div>
          </Collapse>
        </li>



        <li className={this.isPathActive('/txlogs') || this.state.txLogsMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ txLogsMenuOpen: !this.state.txLogsMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-news-paper"></i>
            <p>Tx logs <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.txLogsMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/txlogs/buy-package-logs') ? 'active' : null}>
                  <Link to="/txlogs/buy-package-logs">Package Buy Logs</Link>
                </li>                
              </ul>                         
            </div>
          </Collapse>
        </li>
        <li className="btn-logout">
            <a href="/logout">  <i className="pe-7s-power"></i><p>Logout</p></a>
        </li>        
      </ul>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Nav);
