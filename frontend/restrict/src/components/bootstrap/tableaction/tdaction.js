import React, {useContext} from 'react';
//import { TableContext } from "components/bootstrap/tableaction/tablecontext"
import { NavLink } from "react-router-dom";
import { get_uuid } from 'helpers/functions';


function Tdaction({objrow, objconf}) {
  
  const ddid = get_uuid()
  
  const keyname = (objconf!=null && typeof(objconf.KEYFIELD)!="undefined") ? objconf.KEYFIELD : "id"
  const keyval = objrow[keyname]

  const get_replaced = (string, key) => !string ? "" : string.replace("%key%",key)

  const get_li = (actions, action)=> {
    const objaction = actions[action]
    return objaction.url !="" ? (  
      <li key={get_uuid()}>
        <NavLink className="dropdown-item" exact to={get_replaced(objaction.url, keyval)}> 
          <span><i className={objaction.icon}></i>&nbsp;{objaction.text}</span>
        </NavLink>
      </li>
    ): null
  }

  const get_lis = () => Object.keys(objconf.ACTIONS).map(action => get_li(objconf.ACTIONS, action))

  return (
    <td>
      <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" id={ddid} data-toggle="dropdown" aria-expanded="false">
          <span><i className="fa fa-bars"></i></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby={ddid}>
          {get_lis()}
        </ul>
      </div>  
    </td>
  )
}

export default Tdaction;
