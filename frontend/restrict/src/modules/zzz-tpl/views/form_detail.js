import React, {useState, useEffect} from "react"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import {useParams} from "react-router-dom"
import {async_get_by_id} from "modules/zzz-tpl/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

const formdefault = {
  insert_date: "",
  insert_user:"",
  update_date: "",
  update_user:"",

  id: -1,
  id_user: -1,

  //%FIELDS_DETAIL%
}

function ZzzTplDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")

  const [formdata, set_formdata] = useState(formdefault)

  const async_refresh = async () => {
    await async_onload()
  }
 
  const async_onload = async () => {
    set_issubmitting(true)
    set_error("")
    set_success("")
    console.log("zzz_tpl.detail.onload.formdata:",formdata)
    try{
      const r = await async_get_by_id(id)
      console.log("zzz_tpl.detail.onload.r",r)
      
      if(!r){
        set_error("Tpl not found!")
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
        set_success(`Tpl Nº:${id} refreshed!`)
      } 
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }    
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.detail unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">ZzzTpl Info</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>
        <div>
          {error && <AlertSimple message={error} type="danger"  />}
          {success && <ToastSimple message={success} title="Success" isvisible={true}  />}

          <div className="row">
            <div className="col-6">Nº</div>
            <div className="col-6">{formdata.id}&nbsp;&nbsp;&nbsp;
              <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} />
            </div>
          </div>

          %FORM_DETAIL%

          <Sysfields sysdata={formdata} />          
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplDetail;
