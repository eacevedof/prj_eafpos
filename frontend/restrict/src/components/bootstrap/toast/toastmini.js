import React, {useEffect, useContext, useRef, useState} from "react"
import {GlobalContext} from "components/context/global_context";
import bs from "components/bootstrap/dist/bs"

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMini() {

  const {errorg, warningg, successg} = useContext(GlobalContext)
  const [message, set_message] = useState({
    text: "", css: "info"
  })
  const refdiv = useRef(null)

  const is_empty = () => Object.keys(successg).length === 0 && Object.keys(warningg).length === 0 &&  Object.keys(errorg).length === 0

  const get_message = () => {
    const text = errorg.message ?? warningg.message ?? successg.message ?? ""
    const css = errorg.message ? "danger" :
                warningg.message ? "warning" :
                successg.message ? "success" : "info"
    return {
      text,
      css,
    }
  }

  const showit = () => {
    const $div = refdiv.current ?? null
    if($div) {
      const t = new bs.Toast($div)
      t.show()
    }
  }

  useEffect(()=>{
    console.log("toastmini.useffect")
    set_message(get_message())
    showit()
    return () => console.log("toastmini unmounting")
  }, [errorg, warningg, successg])

  if(is_empty()) return null

  return (
    <div ref={refdiv} className={`toast align-items-center text-white bg-${message.css} border-0 position-absolute top-0 end-0`}
         role="alert" aria-live="assertive" aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {message.text}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  )
}

export default ToastMini