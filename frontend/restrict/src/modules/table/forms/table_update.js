import React, {useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/table/config/config"
import {async_get_by_id, async_update,} from "modules/table/async/async_requests"
import get_field from "helpers/form"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"


function TableUpdate(){

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
    code_erp:"",
    description:"",

    diner_names:"",
    diner_num:0,
    coord_x:0,
    coord_y:0,
    time_start: null,
    reserved: "",
    id_user: -1,
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
    console.log("table.update.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      console.log("table.update.on_submit.inputfile",inputfile)
      //hacer insert y enviar fichero
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
      console.log("table.update.onload.r",r)
      const temp = {...formdata, ...r}
      console.log("TTTTEMPPP",temp)
      temp.time_start =  temp.time_start.replace(" ","T")
      set_formdata(temp)
  
      console.log("table.update.onload.formdata:",formdata)
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
    return ()=> console.log("table.update unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Table update</h1>
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
            <label htmlFor="txt-description" className="form-label">Description</label>
            <input type="text" className="form-control" id="txt-description" placeholder="Where is located, max number, etc"

                   value={formdata.description}
                   onChange={updateform}
            />
          </div>

          <div className="col-12">
            <label htmlFor="txt-diner_names" className="form-label">Diner names</label>
            <input type="text" className="form-control" id="txt-diner_names" placeholder="Diner names in comma separated values"
                   value={formdata.diner_names}
                   onChange={updateform}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-diner_num" className="form-label">Diner num.</label>
            <input type="number" className="form-control" id="num-diner_num" placeholder="price in default currency"
                   value={formdata.diner_num}
                   onChange={updateform}
                   required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-coord_x" className="form-label">Pos. x</label>
            <input type="number" className="form-control" id="num-coord_x" title="x coordinate in dining room"
                   value={formdata.coord_x}
                   onChange={updateform}
                   required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-coord_y" className="form-label">Pos. y</label>
            <input type="number" className="form-control" id="num-coord_y" title="y coordinate in dining room"
                   value={formdata.coord_y}
                   onChange={updateform}
                   required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="txa-reserved" className="form-label">Reserved</label>
            <textarea type="number" className="form-control" id="txa-reserved"
                      maxLength="250"
                      placeholder="notes about booking. Time, max time, name of diner, phone, email, etc"
                      value={formdata.reserved}
                      onChange={updateform}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-time_start" className="form-label">Time start</label>
            <input type="datetime-local" className="form-control" id="num-time_start"
                   pattern="[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}"
                   value={formdata.time_start}
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

export default TableUpdate;
