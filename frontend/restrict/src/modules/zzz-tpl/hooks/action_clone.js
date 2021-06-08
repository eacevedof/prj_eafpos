import {useParams} from "react-router-dom"
import {useEffect, useRef, useState} from "react"
import {
  async_clone,
  async_get_by_id
} from "../async/async_requests"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {seldisplay} from "modules/common/options"

const formdefault = {
  insert_user:"",
  insert_date:"",
  update_date:"",
  update_user:"",

  id: -1,
  id_user: -1,

  //%FIELDS_CLONE%
}

function ZzzTplClone() {
  const {id} = useParams()
  const refcode = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("zzz_tpl.clon.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()
    try {
      const r = await async_clone(formdata)
      set_success("Tpl cloned. Nº: ".concat(r))
      refcode.current.focus()
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }

  }// on_submit

  const async_onload = async () => {

    console.log("zzz_tpl.clone.onload.formdata:",formdata)
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      console.log("zzz_tpl.clone.onload.r",r)
      const temp = {...formdata, ...r}
      set_formdata(temp)
    }
    catch (error){
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }

  }// async_onload

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.clone unmounting")
  },[id])

  return {
    scrumbs:MODCONFIG.SCRUMBS.GENERIC,

    success,
    error,
    formdata,
    refcode,

    issubmitting,
    async_refresh,
    on_submit,
  }
}

export default ZzzTplClone