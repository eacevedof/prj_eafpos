import React, {useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import { is_empty } from "helpers/functions"
import {async_get_by_id, async_delete} from "modules/zzz-tpl/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"


function ZzzTplDelete(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)
  const [isdeleted, set_isdeleted] = useState(false)

  const [formdata, set_formdata] = useState({
    insert_user:"",
    insert_date:"",
    update_date:"",
    update_user:"",    
    delete_user:"",
    delete_date:"",

    id: -1,
    id_user: -1,

    //%FIELDS_DELETE%
  })

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("zzz_tpl.delete.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    //hacer insert y enviar fichero
    before_submit()
    
    try {
      const r = await async_delete(formdata)
      console.log("zzz_tpl.delete.on_submit.r",r)
      set_success("Num regs deleted: ".concat(r))
      //async_onload()
      set_isdeleted(true)
      refcode.current.focus()
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  } // on_submit

  const async_onload = async () => {
    set_issubmitting(true)
    try {
      const r = await async_get_by_id(id)

      console.log("zzz_tpl.delete.onload.r",r)
      const tmpform = {...formdata, ...r}
      console.log("zzz_tpl.delete.onload.tmpform",tmpform)
      set_formdata(tmpform)
      if(is_empty(r)){
        set_error("ZzzTpl not found")
        set_isdeleted(true)
      }
    } 
    catch (error) {
      set_error(error)
    } 
    finally {
      console.log("zzz_tpl.delete.onload.formdata:",formdata)
      set_issubmitting(false)      
    }
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.delete unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">ZzzTpl delete</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success!==""? <AlertSimple message={success} type="success" />: null}
          {error!==""? <AlertSimple message={error} type="danger" />: null}
          {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}
          {error!==""? <ToastSimple message={error} title="Error" isvisible={true} />: null}


          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control border-0" id="txt-code_erp" placeholder="code in your system" 

              ref={refcode}
              value={formdata.code_erp}
              disabled 
            />
          </div>
          {
            isdeleted ? null:(
              <div className="col-md-3">
                <RefreshAsync issubmitting={issubmitting} fnrefresh={async_refresh} />
              </div>
            )
          }

          %FORM_DELETE%

          <Sysfields sysdata={formdata} />
          {
            isdeleted ? null:(
              <div className="col-12">
                <SubmitAsync innertext="Delete" type="danger" issubmitting={issubmitting} />
              </div>   
            )
          }
        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplDelete;
