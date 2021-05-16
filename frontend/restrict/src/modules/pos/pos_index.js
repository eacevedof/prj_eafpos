import React, {useContext, useState, useEffect, useRef} from "react"

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
import ToastMini from "components/bootstrap/toast/toastmini"
import ToastSimple from "../../components/bootstrap/toast/toastsimple";
//import {Toast} from "../public/bootstrap-5.0.0-dist/js/bootstrap.esm.min.js"
//import {Toast} from "components/bootstrap/dist/x"

//import { Toast } from 'bootstrap.esm.min.js'

function PosIndex() {
  
  //const div = useRef(null)
  const history = useHistory()
  //const {is_loading, set_is_loading, set_products, search} = useContext(GlobalContext)
  const [success, set_success] = useState("")
  const [error, set_error] = useState("")

  const on_click = () => {
    console.log("clicked.success", success)
    set_success("ok")
  }

  const async_onload = async () => {
    let is_pinned = false
    try {
      is_pinned = await async_ispinned()
    }
    catch(error) {
      set_error(error)
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
        {success!=="" ? 
        <ToastMini message={success} title="Success" isvisible={true} /> : 
        <ToastMini message={success} title="Success" isvisible={false} />
        }

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
