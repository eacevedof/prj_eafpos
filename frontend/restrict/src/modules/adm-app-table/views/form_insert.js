import React, {useState, useEffect, useRef} from "react"
import {MODCONFIG} from "modules/adm-app-table/config/config"
import get_field from "helpers/form"
import {async_insert} from "modules/adm-app-table/async/async_repository"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import Footer from "components/common/footer"

function AppTableInsert() {

  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)

  const formdefault = {
    id_user:-1,

    code_erp: "", //varchar(25)
description: "", //varchar(250)
diner_names: "", //varchar(250)
diner_num: 0, //int(10,0)
coord_x: "", //varchar(5)
coord_y: "", //varchar(5)
time_start: "", //timestamp
order_by: 0, //int(10,0)
reserved: "", //varchar(250)
  }

  const [formdata, set_formdata] = useState({...formdefault})

  const updateform = evt =>{
    const elem = evt.target
    const field = get_field(elem)
    const temp = {...formdata}
    temp[field] = elem.value
    set_formdata(temp)
  }

  const before_submit = () => {

  }

  const on_submit = async (evt)=>{
    console.log("app_table.insert.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      before_submit()
      console.log(formdata)
      const r = await async_insert(formdata)
      console.log("app_table.insert.on_submit.r",r)

      set_success("New table added. Nº: ".concat(r))
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
    console.log("app_table.insert.useeffect")
    async_onload()
    return ()=> console.log("app_table.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Table insert</h1>
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

          
          <div className="col-12">
            <label htmlFor="txt-code_erp" className="form-label">label-code_erp</label>
            <input type="text" className="form-control" id="txt-code_erp" placeholder="placeholder-code_erp"
              value={formdata.code_erp}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-description" className="form-label">label-description</label>
            <input type="text" className="form-control" id="txt-description" placeholder="placeholder-description"
              value={formdata.description}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-diner_names" className="form-label">label-diner_names</label>
            <input type="text" className="form-control" id="txt-diner_names" placeholder="placeholder-diner_names"
              value={formdata.diner_names}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-diner_num" className="form-label">label-diner_num</label>
            <input type="text" className="form-control" id="txt-diner_num" placeholder="placeholder-diner_num"
              value={formdata.diner_num}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="num-coord_x" className="form-label">label-coord_x</label>
            <input type="number" className="form-control" id="num-coord_x" placeholder="placeholder-coord_x"
                   min="0" max="9"
              value={formdata.coord_x}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="num-coord_y" className="form-label">label-coord_y</label>
            <input type="number" className="form-control" id="num-coord_y" placeholder="placeholder-coord_y"
                   min="0" max="9"
              value={formdata.coord_y}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-time_start" className="form-label">label-time_start</label>
            <input type="text" className="form-control" id="txt-time_start" placeholder="placeholder-time_start"
              value={formdata.time_start}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-order_by" className="form-label">label-order_by</label>
            <input type="text" className="form-control" id="txt-order_by" placeholder="placeholder-order_by"
              value={formdata.order_by}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-12">
            <label htmlFor="txt-reserved" className="form-label">label-reserved</label>
            <input type="text" className="form-control" id="txt-reserved" placeholder="placeholder-reserved"
              value={formdata.reserved}
              onChange={updateform}
            />
          </div> 
        

          <div className="col-12">
            <SubmitAsync innertext="Save" type="primary" issubmitting={issubmitting} />
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default AppTableInsert;
