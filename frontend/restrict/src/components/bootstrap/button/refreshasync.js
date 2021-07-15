import React, {memo} from "react"

//type: primary, secondary, success, danger, warning, info, light, dark
function RefreshAsync({issubmitting, onrefresh, css}) {

  const cssbutton = css ?? `btn btn-info`
  const disabled = issubmitting ? "disabled" : null
  const strloading = " Loading..."

  return (
    <button type="button" className={cssbutton} disabled={disabled} onClick={onrefresh}>
      {issubmitting ?
        (<>

        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {strloading}
        </>)
      :
        <i className="fa fa-sync-alt" aria-hidden="true"></i>
      }
    </button>
  )
}

export default memo(RefreshAsync)
