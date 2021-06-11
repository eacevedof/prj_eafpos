import React, {useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import { is_empty } from "helpers/functions";
import {async_get_by_id, async_delete} from "modules/zzz-tpl/async/async_repository"
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

  //%FIELDS_DELETE%
}

function ActionDelete(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)
  const [isdeleted, set_isdeleted] = useState(false)

  const [formdata, set_formdata] = useState(formdefault)

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("zzz_tpl.delete.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    before_submit()

    try {
      const r = await async_delete(formdata)
      console.log("zzz_tpl.delete.on_submit.r",r)
      set_success("Num regs deleted: ".concat(r))
      set_isdeleted(true)
      refcode.current.focus()
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  } // on_submit

  const async_onload = async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)

      console.log("zzz_tpl.delete.onload.r",r)
      const tmpform = {...formdata, ...r}
      console.log("zzz_tpl.delete.onload.tmpform",tmpform)
      set_formdata(tmpform)
      if(is_empty(r)){
        set_error("ZzzTpl not found")
        set_isdeleted(true)
      }
    }
    catch (error) {
      set_error(error)
    }
    finally {
      console.log("zzz_tpl.delete.onload.formdata:",formdata)
      set_issubmitting(false)
    }
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.delete unmounting")
  },[])


  return {
    breadscrumb: MODCONFIG.SCRUMBS.GENERIC,
    success,
    error,
    refcode,
    formdata,

    on_submit,
    issubmitting,
    isdeleted,
    async_refresh,
    seldisplay,
  }
}

export default ActionDelete;
