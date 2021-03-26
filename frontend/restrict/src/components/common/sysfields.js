import React, {useState, useEffect} from 'react';
import async_get_useralias from "modules/sysfields/sysfields_index"
import {is_defined, pr} from "helpers/functions"

function Sysfields({sysdata}){

  const [objsys, set_objsys] = useState({...sysdata})
  const [isdeleted, set_isdeleted] = useState(false)

  const async_onload = async () => {   
    const insert_user = await async_get_useralias(sysdata.insert_user)
    const update_user = await async_get_useralias(sysdata.update_user)
    const delete_user = await async_get_useralias(sysdata.delete_user)
    
    if(sysdata.delete_date) set_isdeleted(true)
    set_objsys({...sysdata, insert_user, update_user, delete_user})
  }

  useEffect(()=>{
    
    async_onload()
    return () => console.log("sysfields.unmount")

  },[sysdata])

  return (
    <>
      <div className="row">
        <div className="col-3">Created at:</div>
        <div className="col-3">{objsys.insert_date}</div>
        <div className="col-3">Created by:</div>
        <div className="col-3">{objsys.insert_user}</div>              
      </div>
      <div className="row">
        <div className="col-3">Modified at:</div>
        <div className="col-3">{objsys.update_date}</div>
        <div className="col-3">Modified by:</div>
        <div className="col-3">{objsys.update_user}</div>                        
      </div>    
      {
        isdeleted ? (
          <div className="row alert-danger">
            <div className="col-3">Deleted at:</div>
            <div className="col-3">{objsys.delete_date}</div>
            <div className="col-3">Deleted by:</div>
            <div className="col-3">{objsys.delete_user}</div>
          </div>
        ): null
      }
    </>
  )

}

export default Sysfields;
