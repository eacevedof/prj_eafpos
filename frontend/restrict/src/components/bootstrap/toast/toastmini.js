import React, {useEffect, useContext, useRef, useState} from "react"
import {GlobalContext} from "components/context/global_context";
import bs from "components/bootstrap/dist/bs"

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMini({type}) {

  const {errorg, warningg, successg, set_errorg, set_warningg, set_successg} = useContext(GlobalContext)
  const [message, set_message] = useState({
    text: "", css: "dark"
  })

  const refdiv = useRef(null)

  const is_empty = () => (
      (Object.keys(successg).length === 0 && ["info","light","primary","success"].filter(color => color===type).length === 0)
      &&
      (Object.keys(warningg).length === 0 && ["warning"].filter(color => color===type).length === 0)
      &&
      (Object.keys(errorg).length === 0 && ["danger"].filter(color => color===type).length === 0)
  )

  const get_message = () => {

    let text = ""
    switch (type) {
      case "info":
      case "light":
      case "primary":
      case "success":
        text = successg.message
      break
      case "warning":
        text = warningg.message
      break
      case "danger":
        text = errorg.message
      break
    }

    return {
      text,
      css: type,
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
    return () => {
      console.log("toastmini unmounting")

    }
  }, [])

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