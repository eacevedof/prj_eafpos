import React from 'react';

//type: primary, secondary, success, danger, warning, info, light, dark
function SubmitAsync({innertext, type, issubmitting}) {
  //console.log("submit","innertext:",innertext,"type:", type,"issubmitting:", issubmitting)

  if(!type) type="success"

  const cssbutton = `btn btn-${type}`
  const disabled = issubmitting ? "disabled" : null
  const strloading = " Loading..."

/*
  useEffect(()=>{
    console.log("submitasync.useffect")
    return ()=> console.log("submitasync unmounting")
  },[issubmitting])
*/

  return (
    <button type="submit" className={cssbutton} disabled={disabled}>
      {issubmitting ?
        (<>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {strloading}
        </>)
      :
        innertext
      }
    </button>
  )

}

export default SubmitAsync;
