import React, {useEffect, useState, useRef} from "react"
import bs from "components/bootstrap/dist/bs"
//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMini({message, isvisible}) {

  const [show, set_show] = useState(isvisible)
  const div = useRef(null)
  
  const showit = () => {
    console.log("showit")
    const t = new bs.Toast(div.current)
    //t.hide()
    t.show()
  }

  const close = () => {
    const t = new bs.Toast(div.current)
    t.hide()
  }

  useEffect(()=>{
    if(show)
      showit()
    console.log("toastsimple.useffect")
    return ()=> console.log("toastsimple unmounting")
  },[isvisible])

  const stylesuccess = {
    position: "absolute",
    zIndex: 10,
    bottom:0,
    right:0,
    background: "#D4EDD9",
    color: "#3D7B50"    
  }

  const styleerror = {
    ...stylesuccess,
    background: "#F8D7DA",
    color: "#762936"
  }

  if(show)
    return (
      <div ref={div} className="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">
            {message}
          </div>
          <button onClick={close} type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    )

  return null

}

export default ToastMini;
