import React, {useEffect, useContext, useRef} from "react"
import {GlobalContext} from "components/context/global_context";
import bs from "components/bootstrap/dist/bs"

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMiniSuccess() {

  const {successg} = useContext(GlobalContext)
  const refdiv = useRef(null)

  const is_empty = () => (Object.keys(successg).length === 0)

  const showit = () => {
    const $div = refdiv.current ?? null
    if($div) {
      (new bs.Toast($div)).show()
    }
  }

  useEffect(()=>{
    console.log("toastminisuccess.useffect")
    showit()
    return () => {
      console.log("toastminisuccess unmounting")
    }
  }, [successg])

  if(is_empty()) return null

  return (
    <div ref={refdiv} className={`toast align-items-center text-white bg-success border-0 position-absolute top-0 end-0`}
         role="alert" aria-live="assertive" aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {successg.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  )
}

export default ToastMiniSuccess