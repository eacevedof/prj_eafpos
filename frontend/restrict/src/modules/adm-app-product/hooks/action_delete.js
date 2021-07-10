import React, {useState, useEffect, useRef, useCallback} from "react"
import {useHistory, useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import { is_empty } from "helpers/functions";
import {async_get_by_id, async_delete} from "modules/adm-app-product/async/async_repository"
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

function ActionDelete(){

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const history = useHistory()
  const {id} = useParams()
  const refcode = useRef(null)

  const async_onload = useCallback(async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      const tmpform = {...formdata, ...r}
      set_formdata(tmpform)
      if(is_empty(r)){
        set_error("Product not found")
      }
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  },[])

  const async_refresh = async () => await async_onload()

  const before_submit = () => {}

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()
      const r = await async_delete(formdata)
      set_success("Num regs deleted: ".concat(r))
      history.push("/admin/products")
    }
    catch (error) {
      set_error(error)
      set_issubmitting(false)
    }

  },[formdata]) //on_submit

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.delete unmounting")
  },[])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    success,
    error,
    refcode,
    formdata,
    issubmitting,
    seldisplay,

    on_submit,
    async_refresh,
  }
}

export default ActionDelete;
