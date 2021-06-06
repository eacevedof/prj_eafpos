import React, {useState, useEffect, useRef} from "react"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import get_field from "helpers/form"
import {async_insert} from "modules/zzz-tpl/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import Footer from "components/common/footer"

const formdefault = {
  id_user:-1,

  //%FIELDS_INSERT%
}

function ZzzTplInsert() {

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)
  const [formdata, set_formdata] = useState(formdefault)

  const updateform = evt =>{
    const elem = evt.target
    const field = get_field(elem)
    const temp = {...formdata}
    temp[field] = elem.value
    set_formdata(temp)
  }

  const before_submit = () => {}

  const on_submit = async (evt)=>{
    console.log("zzz_tpl.insert.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()
      console.log(formdata)
      const r = await async_insert(formdata)
      console.log("zzz_tpl.insert.on_submit.r",r)

      set_success("New tpl added. Nº: ".concat(r))
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
    console.log("zzz_tpl.insert.useeffect")
    async_onload()
    return ()=> console.log("zzz_tpl.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Tpl insert</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success && <AlertSimple message={success} type="success"  />}
          {error && <AlertSimple message={error} type="danger"  />}

          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control" id="txt-code_erp" placeholder="code in your system" 
            
              ref={refcode}
              value={formdata.code_erp}
              onChange={updateform}
              required 
            />
          </div>

          %FORM_INSERT%

          <div className="col-12">
            <SubmitAsync innertext="Save" type="primary" issubmitting={issubmitting} />
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplInsert;
