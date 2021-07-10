import React, {useState, useEffect, useRef, useCallback} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {is_defined, is_empty, is_string, isset} from "helpers/functions"
import {async_get_by_id, async_update, async_get_maxuploadsize} from "modules/adm-app-product/async/async_repository"
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
  id_user: -1,
}

const get_id = elem => {
  const idpref = elem.id || ""
  const parts = idpref.split("-")
  //console.log("parts",parts)
  if(parts.length>1) return parts[1]
  //console.log("elem.idpref",idpref)
  return idpref
}

function ActionUpdate(){

  const {id} = useParams()
  const refcode = useRef(null)
  const reffile = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [maxsize, set_maxsize] = useState(0)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [inputfile,set_inputfile] = useState(null)

  const [formdata, set_formdata] = useState(formdefault)

  const updatefile = elem => {
    const id = get_id(elem)
    if(id !== "url_image") return 

    if(!is_empty(elem.files[0]))
      set_inputfile(elem.files[0])
    else 
      set_inputfile(null)
  }

  const updateform = useCallback(evt => {
    const elem = evt.target
    const id = get_id(elem)
    const tmpform = { ...formdata }
    tmpform[id] = elem.value.includes("C:\\fakepath\\") ? "" : elem.value
    updatefile(elem)
    //console.log("product.updatform.changed", tmpform)
    set_formdata(tmpform)
  },[formdata])

  const before_submit = () => {
    if(isset(inputfile) && is_defined(inputfile.size)){
      if(inputfile.size > maxsize)
        throw `File ${inputfile.name} is larger than allowed. File size: ${inputfile.size}, Max allowed: ${maxsize}`
    }
  }

  const async_refresh = async () => await async_onload()

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      before_submit()

      const url_image = inputfile ? inputfile : formdata.url_image
      console.log("product.update.on_submit.formdata:",formdata)
      const r = await async_update({...formdata, url_image})

      set_success("Num regs updated: ".concat(r))
      async_onload()
      set_inputfile(null)
      refcode.current.focus()
      reffile.current.value = null
      
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  },[formdata])// on_submit

  const async_onload = useCallback(async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      const temp = {...formdata, ...r}
      set_formdata(temp)

      const size = await async_get_maxuploadsize()
      set_maxsize(size)
      set_issubmitting(false)
      refcode.current.focus()      
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  }, [])

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.update unmounting")
  },[])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    on_submit,
    success, error,
    refcode, formdata, updateform,
    issubmitting, seldisplay, reffile,
    maxsize, inputfile,
    async_refresh
  }
}

export default ActionUpdate;
