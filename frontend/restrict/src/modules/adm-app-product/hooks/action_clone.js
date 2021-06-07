import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {
  async_clone,
  async_get_by_id
} from "../async/async_requests";
import {get_pages} from "helpers/functions";
import {grid, VIEWCONFIG} from "../async/queries/query_list";
import {async_ispinned} from "modules/login/async/login_checker";
import HrefDom from "helpers/href_dom";
import db from "helpers/localdb";
import {MODCONFIG} from "modules/adm-app-product/config/config"

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

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()
    try {
      const r = await async_clone(formdata)
      set_success("Product cloned. Nº: ".concat(r))
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

    console.log("product.clone.onload.formdata:",formdata)
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      console.log("product.clone.onload.r",r)
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
    return ()=> console.log("product.clone unmounting")
  }, [id])


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

export default  ActionClone