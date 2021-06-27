import React, {useState, useEffect, useCallback} from "react"
import async_get_useralias from "modules/adm-sysfields/sysfields_repository"

function Sysfields({formdata}){

  const [sysfields, set_sysfields] = useState({
    insert_user: formdata.insert_user,
    insert_name: "",
    update_user: formdata.update_user,
    update_name: "",
    delete_user: formdata.delete_user,
    delete_name: "",

    insert_date: formdata.insert_date,
    update_date: formdata.update_date,
    delete_date: formdata.delete_date,
  })

  const [isdeleted, set_isdeleted] = useState(false)

  const async_onload = async () => {   
    const insert_name = await async_get_useralias(formdata.insert_user)
    const update_name = await async_get_useralias(formdata.update_user)
    const delete_name = await async_get_useralias(formdata.delete_user)
    
    if(formdata.delete_date) set_isdeleted(true)
    set_sysfields({...formdata, insert_name, update_name, delete_name})
  }

  useEffect(()=>{
    
    async_onload()
    return () => console.log("sysfields.unmount")

  },[formdata])

  return (
    <>
      <div className="row">
        <div className="col-3">Created at:</div>
        <div className="col-3">{sysfields.insert_date}</div>
        <div className="col-3">Created by:</div>
        <div className="col-3">{sysfields.insert_name}</div>
      </div>
      <div className="row">
        <div className="col-3">Modified at:</div>
        <div className="col-3">{sysfields.update_date}</div>
        <div className="col-3">Modified by:</div>
        <div className="col-3">{sysfields.update_name}</div>
      </div>    
      {
        isdeleted ? (
          <div className="row alert-danger">
            <div className="col-3">Deleted at:</div>
            <div className="col-3">{sysfields.delete_date}</div>
            <div className="col-3">Deleted by:</div>
            <div className="col-3">{sysfields.delete_name}</div>
          </div>
        ): null
      }
    </>
  )

}

export default Sysfields;
