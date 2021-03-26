import React, {useEffect, useState} from 'react';

//type: primary, secondary, success, danger, warning, info, light, dark
function ToastSimple({message, title, isvisible}) {

  const [show, set_show] = useState(isvisible)
  const [time] = useState((new Date()).toString().substr(0,24))

  const close = () => set_show(false)
  
  useEffect(()=>{
    console.log("toastsimple.useffect")
    return ()=> console.log("toastsimple unmounting")
  },[])

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
      <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true"
        data-autohide="true"
        style={title==="Success"?stylesuccess:styleerror}
      >
        <div className="toast-header">
          <strong className="mr-auto">{title}</strong>
          <small>{time}</small>
          <button type="button" className="ml-2 mb-1 close" onClick={close} data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    )

  return null

}

export default ToastSimple;
