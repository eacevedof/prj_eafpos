import React, {useEffect} from "react"
//import React, {, useState, useRef} from "react"
//import db from "helpers/localdb"
//import SubmitAsync from "components/bootstrap/button/submitasync"

function ModalClassic({isvisible, fn_onok}){

  const modal = () => {
    const myModal = document.getElementById("my-modal")
    console.log("myModal",myModal)
    if(myModal){
      const m = new window.bootstrap.Modal(myModal, {
        keyboard: false
      })
      m.show()
    }

  }

  useEffect(() => {
    return ()=> console.log("modalc unmounting")
    modal()
  },[isvisible])

  //if(!isvisible) return null
  return (
    <div id="my-modal" className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalClassic
