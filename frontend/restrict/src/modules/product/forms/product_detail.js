import React, {useState, useEffect} from 'react';
import {MODCONFIG} from "modules/product/config/config"
import {pr} from "helpers/functions"

import {useParams} from "react-router-dom"
import {async_get_by_id} from "modules/product/async/async_requests"
import {seldisplay} from "modules/common/options"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"

function ProductDetail(){

  const {id} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")

  const get_seltext = id => {
    const arfound = seldisplay.filter(obj => obj.value===id) || []
    //pr(arfound)
    //return ""
    if(arfound.length>0)
      return arfound[0]["text"]
    return ""
  }

  const [formdata, set_formdata] = useState({
    insert_date: "",
    insert_user:"react",
    update_date: "",
    update_user:"react",

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
  })

  const async_refresh = async () => {
    await async_onload()
  }
 
  const async_onload = async () => {
    set_issubmitting(true)
    set_error("")
    set_success("")
    console.log("product.detail.onload.formdata:",formdata)
    try{
      const r = await async_get_by_id(id)
      console.log("product.detail.onload.r",r)
      
      if(!r){
        set_error("Product not found!")
        return
      }
      else{
        const tmpform = {...formdata, ...r}
        set_formdata(tmpform)
        set_success(`Product Nº:${id} refreshed!`)
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
    return ()=> console.log("product.detail unmounting")
  },[])

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Product Info</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>
        <div>
          {error!==""? <AlertSimple message={error} type="danger" />: null}
          {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}
          {error!==""? <ToastSimple message={error} title="Error" isvisible={true} />: null}
          
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
            <div className="col-6">Slug</div>
            <div className="col-6">{formdata.slug}</div>
          </div>          

          <div className="row">
            <div className="col-6">Description large</div>
            <div className="col-6">{formdata.description_full}</div>
          </div>

          <div className="row">
            <div className="col-6">Price</div>
            <div className="col-6">{formdata.price_sale}</div>
          </div>

          <div className="row">
            <div className="col-6">Price 1</div>
            <div className="col-6">{formdata.price_sale1}</div>
          </div>

          <div className="row">
            <div className="col-6">Display order</div>
            <div className="col-6">{formdata.order_by}</div>
          </div>

          <div className="row">
            <div className="col-6">Display</div>
            <div className="col-6">{get_seltext(formdata.display)}</div>
          </div>

          <div className="row">
            <div className="col-6">Owner</div>
            <div className="col-6">{formdata.id_user}</div>
          </div>          

          <div className="row">
            <div className="col-3">Picture</div>
            <div className="col-9">
            <a className="link-dark" href={formdata.url_image} target="_blank" rel="noopener noreferrer">{formdata.url_image}</a>
              <img src={formdata.url_image} className="img-fluid" alt={formdata.url_image}/>
            </div>
          </div>                      

          <Sysfields sysdata={formdata} />          
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProductDetail;
