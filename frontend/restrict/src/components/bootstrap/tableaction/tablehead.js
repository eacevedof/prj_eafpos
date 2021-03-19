import React, {useEffect, useContext} from 'react';
import { TableContext } from "components/bootstrap/tableaction/tablecontext"
import { is_defined, pr } from 'helpers/functions';


function TableHead({arhead, objconf, multiconf}) {

  const {ismultiaction, set_ismultiaction, multivalues} = useContext(TableContext)

  const is_conf_singleactions = objconf => {
    if(!is_defined(objconf.ACTIONS)) return false
    const actions = Object.keys(objconf.ACTIONS)
    if(actions.length === 0) return false
    return true
  }

  const is_conf_multiaction = multiconf => {
    if(!is_defined(multiconf.ACTIONS)) return false
    const actions = Object.keys(multiconf.ACTIONS)
    if(actions.length === 0) return false
    return true
  }

  const on_multicheck = evt => {
    const ischecked = evt.target.checked
    set_ismultiaction(ischecked)
  }

  useEffect(()=>{
    console.log("tablehead.mounting")
    return ()=> console.log("tablehead.unmounting")
  },[multivalues])


  const get_th_checkall = ()=> (
    <th>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="chk-all" onChange={on_multicheck} checked={ismultiaction} />
        <label className="form-check-label" htmlFor="chk-all"></label>
      </div>
    </th>    
  )

  const get_th_action = () => <th>Action</th>

  const get_tds = ar => ar.map( (objth,i) => <th key={i} scope="col">{objth.text}</th>) // get_tds

  return (
    <thead>      
      <tr>
        { is_conf_multiaction(multiconf) ? get_th_checkall() :null }
        { is_conf_singleactions(objconf) ? get_th_action() : null }
        { get_tds(arhead) }
      </tr>
    </thead>
  )
}

export default TableHead;
