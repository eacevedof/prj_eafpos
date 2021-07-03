import React, {useContext, useEffect} from "react"
import {NavLink, useHistory} from "react-router-dom"
import {GlobalContext} from "components/context/global_context"

import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
//import LoadingWheel from "components/common/loading_wheel"
//import NotificationError from "components/common/notifications/notification_error"
//import HrefDom from "helpers/href_dom"
//import Api from "providers/api"
//import { NavLink } from 'react-router-dom';
import {async_is_pinned} from "modules/pos-login/async/login_checker"
import "modules/pos-dashboard/views/pos_dashboard.css"

function PosIndex() {

  const history = useHistory()

  const async_onload = async () => {
    let is_pinned = false
    try {
      is_pinned = await async_is_pinned()
    }
    catch(error) {
      console.error("posindex.onload.error",error)
    }
    finally {
      if(!is_pinned)
        history.push("/")
    }
  }// async_onload

  useEffect(() => {
    async_onload()
    return () => console.log("dashboard.index unmounting")
  },[])

  return (
    <>
      <Navbar />
      <h2 className="h2 text-center">POS Dashboard</h2>
      <div className="pos-dashboard-grid">
        <div>
          <NavLink className="btn btn-dark pos-dashboard-grid-btn-lg " exact to={"/pos-tables"}>
            <i className="fa fa-chair"></i>&nbsp;Tables
          </NavLink>
        </div>
        <div>
          <NavLink className="btn btn-dark pos-dashboard-grid-btn-lg " exact to={"/pos-bar"}>
            <i className="fa fa-cocktail"></i>&nbsp;Bar
          </NavLink>
        </div>
        <div>
          <NavLink className="btn btn-dark pos-dashboard-grid-btn-lg " exact to={"/pos-take-away"}>
            <i className="fa fa-box-open"></i>&nbsp;Take away
          </NavLink>
        </div>
        <div>
          <NavLink className="btn btn-dark pos-dashboard-grid-btn-lg " exact to={"/pos-order"}>
            <i className="fa fa-shopping-basket"></i>&nbsp;Check out
          </NavLink>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PosIndex;
