import {useState, useEffect, useCallback} from "react"
import {useParams} from "react-router-dom"

import {MODCONFIG} from "modules/adm-app-product/config/config"
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
  if(arfound.length>0)
    return arfound[0]["text"]
  return ""
}

function ActionDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [formdata, set_formdata] = useState(formdefault)

  const async_onload = useCallback(async () => {
    set_issubmitting(true)
    try{
      const r = await async_get_by_id(id)

      if(!r){
        console.log("error product not found", r)
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
      }
    }
    catch(error){
      console.log(error)
    }
    finally{
      set_issubmitting(false)
    }
  },[])

  const async_refresh = useCallback(async () => await async_onload(),[])

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.detail unmounting")
  },[async_onload])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    formdata,
    issubmitting,
    async_refresh,
    get_seltext

  }
}

export default ActionDetail;
