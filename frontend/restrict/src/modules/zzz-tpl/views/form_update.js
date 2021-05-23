import React, {useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import {async_get_by_id, async_update,} from "modules/zzz-tpl/async/async_repository"
import get_field from "helpers/form"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"


function ZzzTplUpdate(){

  const {id} = useParams()
  const refcode = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [inputfile,set_inputfile] = useState(null)

  const formdefault = {
    insert_user:"",
    insert_date:"",
    update_date:"",
    update_user:"",

    id: -1,
    id_user: -1,
    
    //%FIELDS_UPDATE%
  }

  const [formdata, set_formdata] = useState({
    ...formdefault
  })

  const updateform = evt => {
    const elem = evt.target
    const id = get_field(elem)
    const tmpform = { ...formdata }
    tmpform[id] = elem.value
    set_formdata(tmpform)
  }

  const before_submit = () => {
  }

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("zzz_tpl.update.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      console.log("zzz_tpl.update.on_submit.inputfile",inputfile)
      before_submit()
      const r = await async_update({...formdata})
      set_success("Num regs updated: ".concat(r))
      async_onload()
      set_inputfile(null)
      refcode.current.focus()
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
      console.log("zzz_tpl.update.onload.r",r)
      const temp = {...formdata, ...r}
      temp.time_start =  temp.time_start?.replace(" ","T")
      set_formdata(temp)
  
      console.log("zzz_tpl.update.onload.formdata:",formdata)
      set_issubmitting(false)
      refcode.current.focus()      
    }
    catch (error) {
      set_error(error)
    }
    finally {
      set_issubmitting(false)
    }
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.update unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">ZzzTpl update</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          
          {success!==""? <AlertSimple message={success} type="success" />: null}
          {error!==""? <AlertSimple message={error} type="danger" />: null}

          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control" id="txt-code_erp" placeholder="code in your system"

                   ref={refcode}
                   value={formdata.code_erp}
                   onChange={updateform}
                   required
            />
          </div>
          <div className="col-md-3">
            <RefreshAsync issubmitting={issubmitting} fnrefresh={async_refresh} />
          </div>

          %FORM_UPDATE%

          <div className="col-12">
            <SubmitAsync innertext="Save" type="primary" issubmitting={issubmitting} />
          </div>

          <Sysfields sysdata={formdata} />
        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplUpdate;
