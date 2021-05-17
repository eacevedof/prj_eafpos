import React, {useEffect, useContext, useRef} from "react"
import {GlobalContext} from "components/context/global_context"
import bs from "components/bootstrap/dist/bs"

function ToastMiniWarning() {

  const {warningg} = useContext(GlobalContext)
  const refdiv = useRef(null)

  const is_empty = () => (Object.keys(warningg).length === 0)

  const showit = () => {
    const $div = refdiv.current ?? null
    if($div) {
      (new bs.Toast($div)).show()
    }
  }

  useEffect(()=>{
    console.log("toastminiwarning.useffect")
    showit()
    return () => {
      console.log("toastmini unmounting")
    }
  }, [warningg])

  if(is_empty()) return null

  return (
    <div ref={refdiv} className={`toast align-items-center text-dark bg-warning border-0 position-absolute`}
         style={{top:"60px", right:"5px"}}
         role="alert" aria-live="assertive" aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {warningg.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  )
}

export default ToastMiniWarning