import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-table/config/config"
import {async_get_by_id, async_deletelogic} from "modules/adm-app-table/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function AppTableDeleteLogic(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
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

    code_erp: "", //varchar(25)
description: "", //varchar(250)
diner_names: "", //varchar(250)
diner_num: 0, //int(10,0)
coord_x: "", //varchar(5)
coord_y: "", //varchar(5)
time_start: "", //timestamp
order_by: 0, //int(10,0)
reserved: "", //varchar(250)
  })

  const [sysdata, set_sysdata] = useState({
    insert_user:"",
    insert_date:"",
    update_date:"",
    update_user:"",    
    delete_user:"",
    delete_date:"",    
  })

  const before_submit = () => {}

  const async_refresh = async () => {
    await async_onload()
  }  

  const on_submit = async evt => {
    console.log("app_table.deletelogic.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    before_submit()
    
    try {
      const r = await async_deletelogic(formdata)
      console.log("app_table.deletelogic.on_submit.r",r)
      set_success("Num regs deleted: ".concat(r))
      async_onload()
    }
    catch(error){
      set_error(error)
    }
    finally{
      set_issubmitting(false)
    }
  }

  const async_onload = async () => {
    set_issubmitting(true)
    
    try {
      const r = await async_get_by_id(id)
      console.log("app_table.deletelogic.onload.r",r)
      const tmpform = {...formdata, ...r}      
      console.log("app_table.deletelogic.onload.tmpform",tmpform)
      set_formdata(tmpform)
      if(r.delete_date!=="" && r.delete_date!==null) set_isdeleted(true)
      set_sysdata({...tmpform})
      console.log("app_table.deletelogic.onload.formdata:",formdata)      
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
    return ()=> console.log("app_table.deletelogic unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">AppTable delete log.</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success && <AlertSimple message={success} type="success"  />}
          {error && <AlertSimple message={error} type="danger"  />}
          {success && <ToastSimple message={success} title="Success" isvisible={true}  />}
          {error && <ToastSimple message={error} title="Error" isvisible={true}  />}

          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control border-0" id="txt-code_erp" placeholder="code in your system" 
              value={formdata.code_erp}
              disabled 
            />
          </div>
          <div className="col-md-3">
            <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} />
          </div>
         
          
            <div className="col-12">
              <label htmlFor="txt-code_erp" className="form-label">label-code_erp</label>
              <input type="text" className="form-control" id="txt-code_erp" placeholder="placeholder-code_erp" 
                
                value={formdata.code_erp}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-description" className="form-label">label-description</label>
              <input type="text" className="form-control" id="txt-description" placeholder="placeholder-description" 
                
                value={formdata.description}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-diner_names" className="form-label">label-diner_names</label>
              <input type="text" className="form-control" id="txt-diner_names" placeholder="placeholder-diner_names" 
                
                value={formdata.diner_names}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-diner_num" className="form-label">label-diner_num</label>
              <input type="text" className="form-control" id="txt-diner_num" placeholder="placeholder-diner_num" 
                
                value={formdata.diner_num}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-coord_x" className="form-label">label-coord_x</label>
              <input type="text" className="form-control" id="txt-coord_x" placeholder="placeholder-coord_x" 
                
                value={formdata.coord_x}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-coord_y" className="form-label">label-coord_y</label>
              <input type="text" className="form-control" id="txt-coord_y" placeholder="placeholder-coord_y" 
                
                value={formdata.coord_y}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-time_start" className="form-label">label-time_start</label>
              <input type="text" className="form-control" id="txt-time_start" placeholder="placeholder-time_start" 
                
                value={formdata.time_start}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-order_by" className="form-label">label-order_by</label>
              <input type="text" className="form-control" id="txt-order_by" placeholder="placeholder-order_by" 
                
                value={formdata.order_by}
                disabled 
              />
            </div>
        
            <div className="col-12">
              <label htmlFor="txt-reserved" className="form-label">label-reserved</label>
              <input type="text" className="form-control" id="txt-reserved" placeholder="placeholder-reserved" 
                
                value={formdata.reserved}
                disabled 
              />
            </div>
        

          <Sysfields sysdata={sysdata} />
          {
            isdeleted ? null:(
              <div className="col-12">
                <SubmitAsync innertext="Delete L" type="danger" issubmitting={issubmitting} />
              </div>   
            )
          }
        </form>
      </main>
      <Footer />
    </>
  )
}

export default AppTableDeleteLogic;
