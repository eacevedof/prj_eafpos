import React, {useState, useEffect} from "react"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import {pr} from "helpers/functions"

import {useParams} from "react-router-dom"
import {async_get_by_id} from "modules/zzz-tpl/async/async_repository"
import {seldisplay} from "modules/common/options"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function ZzzTplDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")

  const [formdata, set_formdata] = useState({
    insert_date: "",
    insert_user:"react",
    update_date: "",
    update_user:"react",

    code_erp:"",
    description:"",
    diner_names:"",
    diner_num:0,
    coord_x:0,
    coord_y:0,
    time_start: null,
    reserved: "",
    order_by: "",
  })

  const async_refresh = async () => {
    await async_onload()
  }
 
  const async_onload = async () => {
    set_issubmitting(true)
    set_error("")
    set_success("")
    console.log("table.detail.onload.formdata:",formdata)
    try{
      const r = await async_get_by_id(id)
      console.log("table.detail.onload.r",r)
      
      if(!r){
        set_error("ZzzTpl not found!")
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
        set_success(`ZzzTpl Nº:${id} refreshed!`)
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
    return ()=> console.log("table.detail unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">ZzzTpl Info</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>
        <div>
          {error!==""? <AlertSimple message={error} type="danger" />: null}
          {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}

          <div className="row">
            <div className="col-6">Nº</div>
            <div className="col-6">{formdata.id}&nbsp;&nbsp;&nbsp;
              <RefreshAsync issubmitting={issubmitting} fnrefresh={async_refresh} />
            </div>
          </div>

          <div className="row">
            <div className="col-6">Code</div>
            <div className="col-6">{formdata.code_erp}</div>
          </div>
          
          <div className="row">
            <div className="col-6">Description</div>
            <div className="col-6">{formdata.description}</div>
          </div>

          <div className="row">
            <div className="col-6">Diner names</div>
            <div className="col-6">{formdata.diner_names}</div>
          </div>          

          <div className="row">
            <div className="col-6">Diner num</div>
            <div className="col-6">{formdata.diner_num}</div>
          </div>

          <div className="row">
            <div className="col-6">x</div>
            <div className="col-6">{formdata.coord_x}</div>
          </div>

          <div className="row">
            <div className="col-6">y</div>
            <div className="col-6">{formdata.coord_y}</div>
          </div>

          <div className="row">
            <div className="col-6">Time start</div>
            <div className="col-6">{formdata.time_start}</div>
          </div>

          <div className="row">
            <div className="col-6">Order by</div>
            <div className="col-6">{formdata.order_by}</div>
          </div>

          <Sysfields sysdata={formdata} />          
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplDetail;
