import React, {useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import {async_get_by_id, async_clone} from "modules/zzz-tpl/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function ZzzTplClone(){

  const {id} = useParams()
  const refcode = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")

  const formdefault = {
    insert_user:"",
    insert_date:"",
    update_date:"",
    update_user:"",

    id: -1,
    id_user: -1,
    
    //%FIELDS_CLONE%
  }

  const [formdata, set_formdata] = useState({
    ...formdefault
  })

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }  
  
  const on_submit = async (evt)=>{
    console.log("zzz_tpl.clon.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()
    try {
      const r = await async_clone(formdata)
      set_success("Tpl cloned. Nº: ".concat(r))
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
    
    console.log("zzz_tpl.clone.onload.formdata:",formdata)
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)
      console.log("zzz_tpl.clone.onload.r",r)
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
    return ()=> console.log("zzz_tpl.clone unmounting")
  })

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Tpl clone</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success!==""? <AlertSimple message={success} type="success" />: null}
          {error!==""? <AlertSimple message={error} type="danger" />: null}

          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control border-0" id="txt-code_erp" placeholder="code in your system"

              ref={refcode}
              value={formdata.code_erp}
              disabled 
            />
          </div>
          <div className="col-md-3">
            <RefreshAsync issubmitting={issubmitting} fnrefresh={async_refresh} />
          </div>
          
          %FORM_CLONE%
          
          <Sysfields sysdata={formdata} />
          
          <div className="col-12">
            <SubmitAsync innertext="Clone" type="primary" issubmitting={issubmitting} />
          </div>

        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplClone;
