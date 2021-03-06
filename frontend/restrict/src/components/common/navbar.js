//Navbar.js
import React, {memo} from "react"
import { NavLink } from "react-router-dom"
function Navbar() {

  return (
    <header className="mb-2">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" activeClassName="navlink-active" exact to={"/"}>
            <i className="fa fa-home"></i>&nbsp;Home
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#top-navbar" aria-controls="top-navbar" aria-expanded="false"
                  aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="top-navbar">
            <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="navlink-active" exact to={"/pos"}>
                  <i className="fa fa-desktop"></i>&nbsp;POS
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="navlink-active" exact to={"/admin"}>
                  <i className="fa fa-users-cog"></i>&nbsp;Admin
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="navlink-active" exact to={"/"}>
                  <i className="fa fa-sign-out-alt" aria-hidden="true"></i>&nbsp;Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}//Navbar()

export default memo(Navbar)