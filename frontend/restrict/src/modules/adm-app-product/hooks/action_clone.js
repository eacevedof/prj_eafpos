import {useParams} from "react-router-dom"
import {useCallback, useEffect, useRef, useState} from "react"
import {async_clone, async_get_by_id} from "modules/adm-app-product/async/async_repository"

import {MODCONFIG} from "modules/adm-app-product/config/config"
import {seldisplay} from "modules/common/options"

const formdefault = {
  insert_user:"",
  insert_date:"",
  update_date:"",
  update_user:"",

  id: -1,
  code_erp:"",
  description:"",
  slug:"",

  description_full:"",
  price_sale:"0",
  price_sale1:"0",
  order_by:"100",
  display:"0",
  url_image: "",
  id_user:1,
}

function ActionClone() {
  const {id} = useParams()
  const refcode = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const before_submit = () => {}

  const async_onload = async () => {
    console.log("async_onload")
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      //console.log("product.clone.onload.r",r)
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
      const r = await async_clone(formdata)
      set_success(str => str + "Product cloned. Nº: ".concat(r))
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  }// on_submit

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.clone unmounting")
  }, [])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,

    success,
    error,
    formdata,
    refcode,
    seldisplay,

    issubmitting,
    async_refresh,
    on_submit,
  }
}

export default ActionClone