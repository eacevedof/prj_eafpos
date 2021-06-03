import React, {useEffect, useRef} from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
import KeyboardNumber, {keyboard_number} from "components/bootstrap/app/keyboards/keyboard_number"
import "./modalclassic.css"


function ModalClassic({isvisible, fn_onaccept, fn_onclose}){
  const nodeRef = useRef(null)

  useEffect(() => {
    return () => console.log("modalclassic.unmounting")
  },[])

  return ReactDOM.createPortal(
    <CSSTransition
      in={isvisible}
      unmountOnExit
      nodeRef={nodeRef}
      timeout={{ enter: 0, exit: 300 }}
    >
      <div>
        <div className={`modal show ${isvisible ? "modal-show": "modal-hide"}`} aria-hidden="true" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <button type="button" className="btn-close" onClick={fn_onclose} data-bs-dismiss="modal" aria-label="Close"></button>
              <KeyboardNumber/>
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
