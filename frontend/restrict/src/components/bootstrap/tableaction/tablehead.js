import React, {useEffect, useContext, memo} from 'react';
import { TableContext } from "components/bootstrap/tableaction/tablecontext"
import { is_defined } from 'helpers/functions';

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

const get_th_action = () => <th>Action</th>

const get_tds = ar => ar.map( (objth,i) => <th key={i} scope="col">{objth.text}</th>) // get_tds

const get_th_checkall = (fnonmulticheck, ischecked)=> (
    <th>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="chk-all" onChange={fnonmulticheck} checked={ischecked} />
        <label className="form-check-label" htmlFor="chk-all"></label>
      </div>
    </th>
)

function TableHead({arhead, objconf, multiconf}) {

  const {ismultiaction, set_ismultiaction} = useContext(TableContext)

  const on_multicheck = evt => {
    const ischecked = evt.target.checked
    set_ismultiaction(ischecked)
  }

  return (
    <thead>      
      <tr>
        { is_conf_multiaction(multiconf) && get_th_checkall(on_multicheck, ismultiaction)}
        { is_conf_singleactions(objconf) && get_th_action()}
        { get_tds(arhead) }
      </tr>
    </thead>
  )
}

export default memo(TableHead)
