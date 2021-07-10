import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {async_get_by_id, async_deletelogic} from "modules/adm-app-product/async/async_repository"
import {seldisplay} from "modules/common/options"

const formdefault = {
  insert_user:"",
  insert_date:"",
  update_date:"",
  update_user:"",
  delete_user:"",
  delete_date:"",

  id: -1,
  id_user: -1,

  code_erp:"",
  description:"",
  slug:"",
  description_full:"",
  price_sale:"0",
  price_sale1:"0",
  order_by:"100",
  display:"0",
  url_image: "",
}

function ActionDeleteLogic(){

  const {id} = useParams()
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [issubmitting, set_issubmitting] = useState(false)
  const [isdeleted, set_isdeleted] = useState(false)
  const [formdata, set_formdata] = useState(formdefault)

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async evt => {
    evt.preventDefault()
    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()

    try {
      const r = await async_deletelogic(formdata)
      set_success("Num regs deleted: ".concat(r))
      await async_onload()
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  }

  const async_onload = useCallback(async () => {
    set_issubmitting(true)

    try {
      const r = await async_get_by_id(id)
      const tmpform = {...formdata, ...r}
      set_formdata(tmpform)
      if(r.delete_date!=="" && r.delete_date!==null) set_isdeleted(true)
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  },[])

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.deletelogic unmounting")
  },[])

  return {
    breadscrumb: MODCONFIG.SCRUMBS.GENERIC,
    success,
    error,
    formdata,
    issubmitting,
    isdeleted,
    seldisplay,

    async_refresh,
    on_submit,
  }
}

export default ActionDeleteLogic;
