import React from 'react';
import {NavLink} from "react-router-dom"

function Sidebar() {
  return (
      <div className="sidebar" data-color="black">
        <div className="sidebar-wrapper">
          <div className="logo">
              <a href="http://www.elchalanaruba.com" target="_blank" className="simple-text">
                <b>El Chalán Aruba</b>
              </a>
          </div>
          <ul className="nav">
              <li className="nav-item active">
                <NavLink className="nav-link" to={"/"}>
                  <i className="nc-icon nc-chart-pie-35"></i>
                  <b>Products</b>
                </NavLink>
              </li>
            </ul>
        </div>
      </div>
    )
  }//App()
  
  export default Sidebar;