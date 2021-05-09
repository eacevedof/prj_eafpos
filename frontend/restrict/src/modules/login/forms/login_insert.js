import React, {useState, useEffect, useRef} from 'react';
import {MODCONFIG} from "modules/login/config/config"
import {pr, is_empty, isset, is_defined} from "helpers/functions"
import {async_insert, async_get_maxuploadsize} from "modules/login/async/async_requests"
import {seldisplay} from "modules/common/options"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Footer from "components/common/footer"

import KbNumbers from "components/bootstrap/app/kb-numbers/kb_numbers"

function LoginInsert() {

  const [issubmitting, set_issubmitting] = useState(false)
  const [maxsize, set_maxsize] = useState(0)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)


  const formdefault = {
    //id: -1,
    id_user:-1, //hay que cambiarlo por un hash, es el owner del logino
    
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

  const [formdata, set_formdata] = useState({...formdefault})

  const get_id = elem => {
    const idpref = elem.id || ""
    const parts = idpref.split("-")
    //console.log("parts",parts)
    if(parts.length>1) return parts[1]
    //console.log("elem.idpref",idpref)
    return idpref
  }

  const updateform = evt =>{
    const elem = evt.target
    const id = get_id(elem)
    console.log("updateform.id",id)
    const temp = {...formdata}
    let value = elem.value
    if(id=="url_image" && !is_empty(elem.files)) value = elem.files[0]

    console.log("updateform.value",value)
    temp[id] = value
    console.log("updateform temp[id]:",temp)
    set_formdata(temp)

    console.log("updateform.formdata",formdata)
    //console.log("updateform.formdata",formdata,"formdata.url_image",formdata.url_image)
  }

  const before_submit = () => {

    if(isset(formdata.url_image) && is_defined(formdata.url_image.size)){
      if(formdata.url_image.size > maxsize)
        //throw new Error(`File is larger than allowed. File:${formdata.url_image.size}, allowed:${maxsize}`)
        throw `File ${formdata.url_image.name} is larger than allowed. File size: ${formdata.url_image.size}, Max allowed: ${maxsize}`
    }
  }

  const on_submit = async (evt)=>{
    console.log("login.insert.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()

      const r = await async_insert(formdata)
      console.log("login.insert.on_submit.r",r)

      set_success("New login added. Nº: ".concat(r))
      set_formdata({...formdefault})
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
    set_issubmitting(true)
    try {
      const size = await async_get_maxuploadsize()
      set_maxsize(size)
      refcode.current.focus()
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  }// async_onload

  useEffect(()=>{
    console.log("login.insert.useeffect")
    async_onload()
    return ()=> console.log("login.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">       
        <h1 className="mt-2 mb-2">Access code</h1>

        <form className="row g-3" onSubmit={on_submit}>
          {success!==""? <AlertSimple message={success} type="success" />: null}
          {error!==""? <AlertSimple message={error} type="danger" />: null}

          {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}
          {error!==""? <ToastSimple message={error} title="Error" isvisible={true} />: null}

          <KbNumbers />

          <div className="col-12">
            <SubmitAsync innertext="Save" type="primary" issubmitting={issubmitting} />
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default LoginInsert;
