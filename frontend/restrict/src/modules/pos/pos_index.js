import React, {useContext, useState, useEffect} from "react"

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

function PosIndex() {
  const history = useHistory()
  //const {is_loading, set_is_loading, set_products, search} = useContext(GlobalContext)
  //const [is_error, set_is_error] = useState(false)

  const on_click = () => {

  }

  useEffect(() => {
    const check = async () => {
      const is_pinned = await async_ispinned()
      if(!is_pinned){
        history.push("/")
      }
    }
    check()

    return ()=> console.log("dashboard.index unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">POS</h1>
        
        <div className="d-flex justify-content-center bd-highlight mt-2">
          
          <div className="d-flex justify-content-center">
            <div className="p-1">
              <button className="btn btn-dark" type="button" style={css.btn}
                onClick={() => on_click(7)}
              >Mesas</button>
            </div>
            <div className="p-1">
              <button className="btn btn-dark" type="button" style={css.btn}
                onClick={() => on_click(8)}
              >Para llevar</button>
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

export default PosIndex;
