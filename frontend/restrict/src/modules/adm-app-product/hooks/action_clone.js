import {useHistory, useParams} from "react-router-dom"
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

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const {id} = useParams()
  const refcode = useRef(null)
  const history = useHistory()

  const async_onload = useCallback(async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      const temp = {...formdata, ...r}
      set_formdata(temp)
    }
    catch (error){
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  },[])// async_onload

  const async_refresh = async () => await async_onload()

  const before_submit = () => {}

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()
      //console.log("product.clone.formdata", formdata)
      const r = await async_clone(formdata)
      set_success(str => str + "Product cloned. Nº: ".concat(r))
      history.push("/admin/products")
    }
    catch (error) {
      set_error(error)
      set_issubmitting(false)
    }
  },[formdata])//on_submit

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.clone unmounting")
  }, [])

  return {
    success,
    error,

    issubmitting,
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    formdata,
    refcode,
    seldisplay,

    async_refresh,
    on_submit,
  }//return

}

export default ActionClone