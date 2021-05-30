import React, {useEffect} from "react"
//import React, {useContext, useState, useEffect} from "react"
//import {GlobalContext} from "components/context/global_context"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
//import LoadingWheel from "components/common/loading_wheel"
//import NotificationError from "components/common/notifications/notification_error"

//import HrefDom from "helpers/href_dom"
//import Api from "providers/api"
import {useHistory} from "react-router-dom"
import { NavLink } from 'react-router-dom';

import {async_ispinned} from "modules/login/login_index"

function DashboardIndex() {
  const history = useHistory()
  //const {is_loading, set_is_loading, set_products, search} = useContext(GlobalContext)
  //const [is_error, set_is_error] = useState(false)

  const async_onload = async () => {
    console.log("dashboard.index.async_onload")
    const ispinned = await async_ispinned()
    if (!ispinned) {
      history.push("/admin")
      return
    }
  }

  useEffect(() => {
    async_onload()
    return ()=> console.log("dashboard.index unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">Dashboard</h1>
        <div className="row">

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Products</h5>
                <p className="card-text">Configure your plates</p>
                <div className="row">
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/products"}>Products</NavLink>
                  </div>
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/product/insert"}>New</NavLink>
                  </div>                  
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Orders</h5>
                <p className="card-text">Check and manage your orders</p>
                <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/order"}>Orders</NavLink>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Clients</h5>
                <p className="card-text">Your orders' clients</p>
                <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/client"}>Clients</NavLink>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Tables</h5>
                <p className="card-text">Tables configuration</p>
                <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/tables"}>Tables</NavLink>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <p className="card-text"></p>
                <div className="row">
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/user"}>Products</NavLink>
                  </div>
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/user/insert"}>New</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Tables</h5>
                <p className="card-text">Configure your tables</p>
                <div className="row">
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/app-tables"}>Tables</NavLink>
                  </div>
                  <div className="col-6">
                    <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin/app-table/insert"}>New</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
      
      <Footer />      
    </>
  )
}

const css = {
  btn: {
    width: "200px",
    height: "100px",
    fontSize: "32px",
    fontWeight: "bold",
  }
}

export default DashboardIndex;
