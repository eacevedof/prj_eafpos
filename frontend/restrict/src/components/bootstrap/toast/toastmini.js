import React, {useEffect, useContext, useRef} from "react"
import {GlobalContext} from "components/context/global_context";
import bs from "components/bootstrap/dist/bs"

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastMini() {

  const {errorg} = useContext(GlobalContext)
  const refdiv = useRef(null)

  const is_empty = () => Object.keys(errorg).length === 0

  const showit = () => {
    const $div = refdiv.current ?? null
    if($div) {
        const t = new bs.Toast($div)
        t.show()
    }
  }

  useEffect(()=>{
    console.log("toastmini.useffect","errorg",errorg)
    showit()
    return () => console.log("toastmini unmounting")
  }, [errorg])

  if(is_empty()) return null

  return (
    <div ref={refdiv} className="toast align-items-center text-white bg-primary border-0 position-absolute top-0 end-0"
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

export default ToastMini;
