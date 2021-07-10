import {useState, useRef, useCallback} from "react"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {is_empty, isset, is_defined} from "helpers/functions"
import {async_insert, async_get_maxuploadsize} from "modules/adm-app-product/async/async_repository"
import {seldisplay} from "modules/common/options"
import {useHistory} from "react-router-dom";

const formdefault = {
  //id: -1,
  id_user:-1, //hay que cambiarlo por un hash, es el owner del producto

  code_erp:"",
  description:"",
  slug:"",
  description_full:"",
  price_sale:"0",
  price_sale1:"0",
  order_by:"100",
  display:"0",
  url_image: null,
}

const get_id = elem => {
  const idpref = elem.id || ""
  const parts = idpref.split("-")
  if(parts.length>1) return parts[1]
  return idpref
}

function ActionInsert() {

  const [issubmitting, set_issubmitting] = useState(false)
  const [maxsize, set_maxsize] = useState(0)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const refcode = useRef(null)
  const history = useHistory()

  const updateform = useCallback(evt =>{
    const elem = evt.target
    const id = get_id(elem)
    const temp = {...formdata}
    let value = elem.value
    if(id==="url_image" && !is_empty(elem.files)) value = elem.files[0]
    temp[id] = value
    set_formdata(temp)
    //console.log("updateform.formdata",temp)
  },[formdata])

  const before_submit = () => {
    if(isset(formdata.url_image) && is_defined(formdata.url_image.size)){
      if(formdata.url_image.size > maxsize)
        throw `File ${formdata.url_image.name} is larger than allowed. File size: ${formdata.url_image.size}, Max allowed: ${maxsize}`
    }
  }

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()
      console.log("product.insert.on_submit.formdata:",formdata)
      const r = await async_insert(formdata)
      set_success("New product added. Nº: ".concat(r))
      history.push("/admin/products")
    } 
    catch (error) {
      set_error(error)
      set_issubmitting(false)
    } 
  },[formdata]) // on_submit

  /*
  useEffect(()=>{
    console.log("product.insert.useeffect")
    async_onload()
    return ()=> console.log("product.insert.unmounting")
  },[])
  */

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    success,
    error,
    refcode,
    formdata,
    updateform,
    seldisplay,
    issubmitting,
    on_submit,
    maxsize,
  }
}

export default ActionInsert;
