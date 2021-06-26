import React from "react"
import {MODCONFIG} from "modules/adm-app-product/config/config"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"
import ActionDetail from "modules/adm-app-product/hooks/action_detail"

function ProductDetail(){
  const {
    error, success,
    scrumbs,
    formdata,
    issubmitting,
    get_seltext,
    async_refresh,
  } = ActionDetail()

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Product Info</h1>
        <Breadscrumb urls={scrumbs}/>
        <div>
          {error && <AlertSimple message={error} type="danger" />}
          {success && <ToastSimple message={success} title="Success" isvisible={true} />}
          {error && <ToastSimple message={error} title="Error" isvisible={true} />}
          
          <div className="row">
            <div className="col-6">Nº</div>
            <div className="col-6">{formdata.id}&nbsp;&nbsp;&nbsp;
              <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} />
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
