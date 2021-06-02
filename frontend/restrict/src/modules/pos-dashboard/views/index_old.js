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
import {async_ispinned} from "modules/login/async/login_checker"
import "modules/common/pos_table.css"

function PosIndex() {

  const history = useHistory()
  const {set_errorg, set_warningg, set_successg} = useContext(GlobalContext)

  const mesas = () => {
    console.log("clicked.success")
    //set_warningg("some success")
    //set_success(Date.now().toString())
    set_warningg({message:"mesas!"})
  }

  const parallevar = () => {
    console.log("clicked.success")
    set_successg({message:"llevar"})
  }

  const async_onload = async () => {
    let is_pinned = false
    try {
      set_successg({message:"all right"})
      is_pinned = await async_ispinned()
    }
    catch(error) {
      set_errorg({message:error})
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
        <main className="container">
          <h1 className="mt-2 mb-2">POS</h1>
          <div className="d-flex justify-content-center bd-highlight mt-2">
            <div className="d-flex justify-content-center">
              <div className="p-1">
                <NavLink className="btn btn-dark pos-btn-lg" exact to={"/pos-tables"}>
                  <i className="fa fa-table"></i>&nbsp;Tables
                </NavLink>
              </div>
              <div className="p-1">
                <button className="btn btn-dark pos-btn-lg" type="button"
                        onClick={parallevar}
                >Para llevar</button>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </>
  )
}

export default PosIndex;
