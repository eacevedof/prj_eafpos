import React, {useState, useEffect, useCallback} from "react"
import async_get_useralias from "modules/adm-sysfields/sysfields_repository"

function Sysfields({formdata}){

  const formmini = {
    insert_user: formdata.insert_user,
    insert_alias: "",
    update_user: formdata.update_user,
    update_alias: "",
    delete_user: formdata.delete_user,
    delete_name: "",

    insert_date: formdata.insert_date,
    update_date: formdata.update_date,
    delete_date: formdata.delete_date,
  }

  const [sysfields, set_sysfields] = useState(formmini)
  const [isdeleted, set_isdeleted] = useState(false)

  const async_onload = useCallback(async () => {
    const insert_alias = await async_get_useralias(formdata.insert_user)
    const update_alias = await async_get_useralias(formdata.update_user)
    const delete_name = await async_get_useralias(formdata.delete_user)
    
    if(formdata.delete_date) set_isdeleted(true)
    set_sysfields({...formdata, insert_alias, update_alias, delete_name})
  }, [
      formmini.insert_user,
    formmini.insert_date,
    formmini.update_user,
    formmini.update_date,
    formmini.delete_user,
    formmini.delete_date
  ])

  useEffect(()=>{
    
    async_onload()
    return () => console.log("sysfields.unmount")

  },[
    formmini.insert_user,
    formmini.insert_date,
    formmini.update_user,
    formmini.update_date,
    formmini.delete_user,
    formmini.delete_date
  ])

  return (
    <>
      <div className="row">
        <div className="col-3">Created at:</div>
        <div className="col-3">{sysfields.insert_date}</div>
        <div className="col-3">Created by:</div>
        <div className="col-3">{sysfields.insert_alias}</div>
      </div>
      <div className="row">
        <div className="col-3">Modified at:</div>
        <div className="col-3">{sysfields.update_date}</div>
        <div className="col-3">Modified by:</div>
        <div className="col-3">{sysfields.update_alias}</div>
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
