import React, {useEffect} from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
//import React, {, useState, useRef} from "react"
//import db from "helpers/localdb"
//import SubmitAsync from "components/bootstrap/button/submitasync"
import "./modalclassic.css"

function ModalClassic({isvisible, fn_onaccept, fn_onclose}){
  console.log("modal-classic.l-1")

  useEffect(() => {
    return () => console.log("login.insert.unmounting")
  },[])

  return ReactDOM.createPortal(
    <CSSTransition
      in={isvisible}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div>
        <div className={`modal show ${isvisible ? "modal-show": "modal-hide"}`} aria-hidden="true" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="btn-close" onClick={fn_onclose} data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={fn_onclose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={fn_onaccept}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal-backdrop show ${isvisible ? "modal-show": "modal-hide"}`}></div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  )
}

export default ModalClassic
