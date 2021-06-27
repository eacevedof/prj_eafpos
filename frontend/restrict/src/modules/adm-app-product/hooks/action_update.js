import React, {useState, useEffect, useRef} from "react"
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

  const updateform = evt => {
    //console.log("updateform.e.target",e.target)
    //pr("updateform.evt.target",evt.target)
    const elem = evt.target
    console.log("updateform.element:",elem)

    const id = get_id(elem)
    console.log("updateform.id",id)

    const tmpform = { ...formdata }
    //pr(elem.value,"v")

    tmpform[id] = elem.value.includes("C:\\fakepath\\") ? "" : elem.value
    updatefile(elem)

    console.log("updateform.value tmpform:",tmpform)
    set_formdata(tmpform)
    console.log("updateform.formdata",formdata)
  }

  const before_submit = () => {
    //pr(formdata.url_image.size);pr(maxsize)
    
    if(isset(inputfile) && is_defined(inputfile.size)){
      if(inputfile.size > maxsize)
        //throw new Error(`File is larger than allowed. File:${inputfile.size}, allowed:${maxsize}`)
        throw `File ${inputfile.name} is larger than allowed. File size: ${inputfile.size}, Max allowed: ${maxsize}`
    }
  }

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("product.update.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      console.log("product.update.on_submit.inputfile",inputfile)
      //hacer insert y enviar fichero
      before_submit()

      const url_image = inputfile ? inputfile : formdata.url_image
      const r = await async_update({...formdata, url_image})

      console.log("product.update.on_submit.r",r)
 
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
  } // on_submit

  const async_onload = async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      console.log("product.update.onload.r",r)
      const temp = {...formdata, ...r}
      set_formdata(temp)

      const size = await async_get_maxuploadsize()
      set_maxsize(size)

      console.log("product.update.onload.formdata:",formdata)
      set_issubmitting(false)
      refcode.current.focus()      
    }
    catch (error) {
      console.log("product.update.onload.error",error)
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.update unmounting")
  },[])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    on_submit,
    success, error,
    refcode, formdata, updateform,
    issubmitting, async_refresh, seldisplay, reffile,
    maxsize, inputfile
  }
}

export default ActionUpdate;
