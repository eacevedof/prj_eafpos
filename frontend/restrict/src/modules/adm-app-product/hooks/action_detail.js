import React, {useState, useEffect} from 'react';
import {MODCONFIG} from "modules/adm-app-product/config/config"

import {useParams} from "react-router-dom"
import {async_get_by_id} from "modules/adm-app-product/async/async_repository"
import {seldisplay} from "modules/common/options"


const formdefault = {
  insert_date: "",
  insert_user:"react",
  update_date: "",
  update_user:"react",

  code_erp:"",
  description:"",
  slug:"",
  description_full:"",
  price_sale:"0",
  price_sale1:"0",
  order_by:"100",
  display:"0",
  url_image: "",
  id_user: -1,
}

const get_seltext = id => {
  const arfound = seldisplay.filter(obj => obj.value===id) || []
  //pr(arfound)
  //return ""
  if(arfound.length>0)
    return arfound[0]["text"]
  return ""
}

function ActionDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const async_refresh = async () => {
    await async_onload()
  }

  const async_onload = async () => {
    set_issubmitting(true)
    set_error("")
    set_success("")
    console.log("product.detail.onload.formdata:",formdata)
    try{
      const r = await async_get_by_id(id)
      console.log("product.detail.onload.r",r)

      if(!r){
        set_error("Product not found!")
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
        set_success(`Product Nº:${id} refreshed!`)
      }
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
    return ()=> console.log("product.detail unmounting")
  },[])

  return {
    error, success,
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    formdata,
    issubmitting,
    async_refresh,
    get_seltext

  }
}

export default ActionDetail;
