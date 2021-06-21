import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {async_get_by_id, async_deletelogic} from "modules/adm-app-product/async/async_repository"
import {seldisplay} from "modules/common/options"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

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

const sysfields = {
  insert_user:"",
  insert_date:"",
  update_date:"",
  update_user:"",
  delete_user:"",
  delete_date:"",
}

function ActionDeleteLogic(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [isdeleted, set_isdeleted] = useState(false)

  const [formdata, set_formdata] = useState(formdefault)

  const [sysdata, set_sysdata] = useState(sysfields)

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async evt => {
    console.log("product.deletelogic.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()

    try {
      const r = await async_deletelogic(formdata)
      console.log("product.deletelogic.on_submit.r",r)
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

  const async_onload = async () => {
    set_issubmitting(true)

    try {
      const r = await async_get_by_id(id)
      console.log("product.deletelogic.onload.r",r)
      const tmpform = {...formdata, ...r}
      console.log("product.deletelogic.onload.tmpform",tmpform)
      set_formdata(tmpform)
      if(r.delete_date!=="" && r.delete_date!==null) set_isdeleted(true)
      set_sysdata({...tmpform})
      console.log("product.deletelogic.onload.formdata:",formdata)
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.deletelogic unmounting")
  },[])

  return {
    breadscrumb: MODCONFIG.SCRUMBS.GENERIC,
    success,
    error,
    formdata,
    sysdata,

    on_submit,
    issubmitting,
    isdeleted,
    async_refresh,
    seldisplay,
  }
}

export default ActionDeleteLogic;
