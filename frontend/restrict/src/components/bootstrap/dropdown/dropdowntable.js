import React, {useState} from 'react';
import { get_uuid, pr } from 'helpers/functions';

function DropdownTable({multiconf, fnconfirm}) {

  const [selected, set_selected] = useState("")
  const [seltext, set_seltext] = useState("...select")

  const on_click = evt => {   
    set_selected(evt.target.value)
    set_seltext(evt.target.getAttribute("text"))    
  }

  const on_confirm = evt => {
    //alert(evt.target)
    fnconfirm(selected)
  }
  
  const get_btnconfirm = () => {
    if(selected==="") return null
    return (
      <div className="col-3 float-left pl-0">
        <button type="button" className="btn btn-danger" onClick={on_confirm}>
          <i className="fa fa-check-circle" aria-hidden="true"></i> confirm
        </button>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-3">
        <button type="button" className="btn btn-secondary dropdown-toggle"  id="grid-ulmultiaction" data-toggle="dropdown" aria-expanded="false">
          {seltext}
        </button>          
        <ul className="dropdown-menu" aria-labelledby="grid-ulmultiaction">
          {Object.keys(multiconf.ACTIONS).map(action => (
              <li key={get_uuid()}>
                <button 
                  type="button" 
                  className="dropdown-item" 
                  
                  value={action}
                  text={multiconf.ACTIONS[action]["text"]}
                  onClick={on_click}

                  >{multiconf.ACTIONS[action]["text"]}</button>
              </li>
            ))}
        </ul>
      </div>
      {
        get_btnconfirm()
      }
    </div>
  )
}

export default DropdownTable;
