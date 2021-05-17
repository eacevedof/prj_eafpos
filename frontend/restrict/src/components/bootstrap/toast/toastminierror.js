import React, {useEffect, useContext, useRef} from "react"
import {GlobalContext} from "components/context/global_context"
import bs from "components/bootstrap/dist/bs"

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMiniError() {

  const {errorg} = useContext(GlobalContext)
  const refdiv = useRef(null)

  const is_empty = () => (Object.keys(errorg).length === 0)

  const showit = () => {
    const $div = refdiv.current ?? null
    if($div) {
      (new bs.Toast($div)).show()
    }
  }

  useEffect(()=>{
    console.log("toasterror.useffect")
    showit()
    return () => {
      console.log("toastmini unmounting")
    }
  }, [errorg])

  if(is_empty()) return null

  return (
    <div ref={refdiv} className={`toast align-items-center text-white bg-danger border-0 position-absolute`}
         style={{top:"110px", right:"5px"}}
         role="alert" aria-live="assertive" aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {errorg.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  )
}

export default ToastMiniError