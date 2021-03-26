import React, {useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom"
import {MODCONFIG} from "modules/product/config/config"
import {pr, is_defined, is_empty, is_string, isset} from "helpers/functions"
import {async_get_by_id, async_update, async_get_maxuploadsize} from "modules/product/async/async_requests"
import {seldisplay} from "modules/common/options"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function ProductUpdate(){

  const {id} = useParams()
  const refcode = useRef(null)
  const reffile = useRef(null)

  const [issubmitting, set_issubmitting] = useState(false)
  const [maxsize, set_maxsize] = useState(0)
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
    slug:"",
    
    description_full:"",
    price_sale:"0",
    price_sale1:"0",
    order_by:"100",
    display:"0",
    url_image: "",
    id_user: -1,
  }

  const [formdata, set_formdata] = useState({
    ...formdefault
  })

  const get_id = elem => {
    const idpref = elem.id || ""
    const parts = idpref.split("-")
    //console.log("parts",parts)
    if(parts.length>1) return parts[1]
    //console.log("elem.idpref",idpref)
    return idpref
  }

  const updatefile = elem => {
    const id = get_id(elem)
    if(id !== "url_image") return 

    if(!is_empty(elem.files[0]))
      set_inputfile(elem.files[0])
    else 
      set_inputfile(null)
  }

  const updateform = evt => {
    //console.log("updateform.e.target",e.target)
    //pr("updateform.evt.target",evt.target)
    const elem = evt.target
    console.log("updateform.element:",elem)

    const id = get_id(elem)
    console.log("updateform.id",id)

    const tmpform = { ...formdata }
    //pr(elem.value,"v")

    tmpform[id] = elem.value.includes("C:\\fakepath\\") ? "" : elem.value
    updatefile(elem)

    console.log("updateform.value tmpform:",tmpform)
    set_formdata(tmpform)
    console.log("updateform.formdata",formdata)
  }

  const before_submit = () => {
    //pr(formdata.url_image.size);pr(maxsize)
    
    if(isset(inputfile) && is_defined(inputfile.size)){
      if(inputfile.size > maxsize)
        //throw new Error(`File is larger than allowed. File:${inputfile.size}, allowed:${maxsize}`)
        throw `File ${inputfile.name} is larger than allowed. File size: ${inputfile.size}, Max allowed: ${maxsize}`
    }
  }

  const async_refresh = async () => {
    await async_onload()
  }

  const on_submit = async (evt)=>{
    console.log("product.update.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    set_error("")
    set_success("")
    
    try{
      console.log("product.update.on_submit.inputfile",inputfile)
      //hacer insert y enviar fichero
      before_submit()

      const url_image = inputfile ? inputfile : formdata.url_image
      const r = await async_update({...formdata, url_image})

      console.log("product.update.on_submit.r",r)
 
      set_success("Num regs updated: ".concat(r))
      async_onload()
      set_inputfile(null)
      refcode.current.focus()
      reffile.current.value = null
      
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
      const size = await async_get_maxuploadsize()
      set_maxsize(size)
      const r = await async_get_by_id(id)
      console.log("product.update.onload.r",r)
      const temp = {...formdata, ...r}
      set_formdata(temp)
  
      console.log("product.update.onload.formdata:",formdata)
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
    return ()=> console.log("product.update unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Product update</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>

        <form className="row g-3" onSubmit={on_submit}>
          
          {success!==""? <AlertSimple message={success} type="success" />: null}
          {error!==""? <AlertSimple message={error} type="danger" />: null}
          {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}
          {error!==""? <ToastSimple message={error} title="Error" isvisible={true} />: null}

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
            <input type="text" className="form-control" id="txt-description" placeholder="Name of product" 
            
            value={formdata.description}
            onChange={updateform}
            required 
            />
          </div>
          
          <div className="col-12">
            <label htmlFor="txt-description_full" className="form-label">Description large</label>
            <textarea className="form-control" id="txt-description_full" rows="2" placeholder="large description use # if needed upto 3000 chars"
              value={formdata.description_full}
              onChange={updateform}
              required 
            ></textarea>
          </div> 

          <div className="col-md-4">
            <label htmlFor="num-price_sale" className="form-label">Price</label>
            <input type="number" className="form-control" id="num-price_sale" placeholder="price in default currency" 
              value={formdata.price_sale}
              onChange={updateform}
              required    
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-price_sale1" className="form-label">Price 1</label>
            <input type="number" className="form-control" id="num-price_sale1" placeholder="price in second currency" 
              value={formdata.price_sale1}
              onChange={updateform}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-order_by" className="form-label">Order</label>
            <input type="number" className="form-control" id="num-order_by" 
              value={formdata.order_by}
              onChange={updateform}
              required            
            />
          </div>          

          <div className="col-md-6">
            <label htmlFor="sel-display" className="form-label">Display</label>
            <select id="sel-display" className="form-select"
              value={formdata.display}
              onChange={updateform}
              required
            >
              <option>Choose...</option>
              {
                seldisplay.map(obj => (<option key={obj.value} value={obj.value}>{obj.text}</option>))
              }
            </select>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="file-url_image" className="form-label">Picture: </label>
              <input type="file" className="form-control" id="file-url_image" 
                ref={reffile}
                onChange={updateform}
              />
              <small>max: {maxsize}</small>
              {
                !is_empty(inputfile) && is_defined(inputfile.name) ?
                (<ul>
                  <li><small>filename: {inputfile.name}</small></li>
                  <li><small>size: {inputfile.size}</small></li>
                </ul>)
                :null
              }
            </div>
          </div>
          <div className="col-12">
            <SubmitAsync innertext="Save" type="primary" issubmitting={issubmitting} />
          </div>
          {
            is_string(formdata.url_image) ?
            (<div className="col-12">
              <a className="link-dark" href={formdata.url_image} target="_blank" rel="noopener noreferrer">{formdata.url_image}</a>
              <img src={formdata.url_image} className="img-fluid" alt={formdata.url_image}/>
            </div>)
            :null
          }

          <Sysfields sysdata={formdata} />
          
        </form>
      </main>
      <Footer />
    </>
  )
}

export default ProductUpdate;
