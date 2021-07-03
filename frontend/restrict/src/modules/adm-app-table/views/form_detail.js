import React, {useState, useEffect} from "react"
import {MODCONFIG} from "modules/adm-app-table/config/config"
import {useParams} from "react-router-dom"
import {async_get_by_id} from "modules/adm-app-table/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function AppTableDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")

  const [formdata, set_formdata] = useState({
    insert_date: "",
    insert_user:"",
    update_date: "",
    update_user:"",

    id: -1,
    id_user: -1,

    code_erp: "", //varchar(25)
description: "", //varchar(250)
diner_names: "", //varchar(250)
diner_num: 0, //int(10,0)
coord_x: "", //varchar(5)
coord_y: "", //varchar(5)
time_start: "", //timestamp
order_by: 0, //int(10,0)
code_cache: "", //varchar(50)
reserved: "", //varchar(250)
  })

  const async_refresh = async () => {
    await async_onload()
  }
 
  const async_onload = async () => {
    set_issubmitting(true)
    set_error("")
    set_success("")
    console.log("app_table.detail.onload.formdata:",formdata)
    try{
      const r = await async_get_by_id(id)
      console.log("app_table.detail.onload.r",r)
      
      if(!r){
        set_error("Table not found!")
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
        set_success(`Table Nº:${id} refreshed!`)
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
    return ()=> console.log("app_table.detail unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">AppTable Info</h1>
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

          
          <div className="row">
            <div className="col-6">label-code_erp</div>
            <div className="col-6">{formdata.code_erp}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-description</div>
            <div className="col-6">{formdata.description}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-diner_names</div>
            <div className="col-6">{formdata.diner_names}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-diner_num</div>
            <div className="col-6">{formdata.diner_num}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-coord_x</div>
            <div className="col-6">{formdata.coord_x}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-coord_y</div>
            <div className="col-6">{formdata.coord_y}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-time_start</div>
            <div className="col-6">{formdata.time_start}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-order_by</div>
            <div className="col-6">{formdata.order_by}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-code_cache</div>
            <div className="col-6">{formdata.code_cache}</div>
          </div>
        
          <div className="row">
            <div className="col-6">label-reserved</div>
            <div className="col-6">{formdata.reserved}</div>
          </div>
        

          <Sysfields formdata={formdata} />          
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AppTableDetail;
