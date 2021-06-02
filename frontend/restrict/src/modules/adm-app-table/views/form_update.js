import React, {useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-table/config/config"
import {async_get_by_id, async_update,} from "modules/adm-app-table/async/async_repository"
import get_field from "helpers/form"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"


function AppTableUpdate(){

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
    console.log("app_table.update.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      console.log("app_table.update.on_submit.inputfile",inputfile)
      before_submit()
      const r = await async_update({...formdata, id})
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
      console.log("app_table.update.onload.r",r)
      const temp = {...formdata, ...r}
      temp.time_start =  temp.time_start?.replace(" ","T")
      set_formdata(temp)
  
      console.log("app_table.update.onload.formdata:",formdata)
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
    return ()=> console.log("app_table.update unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">AppTable update</h1>
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
        
          <div className="col-3">
            <label htmlFor="num-coord_x" className="form-label">label-coord_x</label>
            <input type="number" className="form-control" id="num-coord_x" placeholder="placeholder-coord_x"
                   min="0" max="9"
              value={formdata.coord_x}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-3">
            <label htmlFor="num-coord_y" className="form-label">label-coord_y</label>
            <input type="number" className="form-control" id="num-coord_y" placeholder="placeholder-coord_y"
                   min="0" max="9"
              value={formdata.coord_y}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-3">
            <label htmlFor="txt-time_start" className="form-label">label-time_start</label>
            <input type="text" className="form-control" id="txt-time_start" placeholder="placeholder-time_start"
              value={formdata.time_start}
              onChange={updateform}
            />
          </div> 
        
          <div className="col-3">
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

          <Sysfields sysdata={formdata} />
        </form>
      </main>
      <Footer />
    </>
  )
}

export default AppTableUpdate;
