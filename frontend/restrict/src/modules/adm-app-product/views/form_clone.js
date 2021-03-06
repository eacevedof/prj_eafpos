import React from "react"
import Navbar from "components/common/navbar"
import AlertSimple from "components/bootstrap/alert/alertsimple"
import ToastSimple from "components/bootstrap/toast/toastsimple"
import Breadscrumb from "components/bootstrap/breadscrumb/breadscrumb"
import RefreshAsync from "components/bootstrap/button/refreshasync"
import SubmitAsync from "components/bootstrap/button/submitasync"
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"
import ActionClone from "modules/adm-app-product/hooks/action_clone"

function ProductClone(){
  const {
    error, success, scrumbs,
    formdata,refcode, seldisplay,
    issubmitting,
    async_refresh, on_submit
  } = ActionClone()

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Product clone</h1>
        <Breadscrumb urls={scrumbs}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success && <AlertSimple message={success} type="success"  />}
          {error && <AlertSimple message={error} type="danger"  />}

          {success && <ToastSimple message={success} title="Success" isvisible={true}  />}
          {error && <ToastSimple message={error} title="Error" isvisible={true}  />}

          <div className="col-md-3">
            <label htmlFor="txt-code_erp" className="form-label">Code</label>
            <input type="text" className="form-control border-0" id="txt-code_erp" placeholder="code in your system"

              ref={refcode}
              value={formdata.code_erp}
              disabled 
            />
          </div>
          <div className="col-md-3">
            <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} />
          </div>
          <div className="col-12">
            <label htmlFor="txt-description" className="form-label">Description</label>
            <input type="text" className="form-control" id="txt-description" placeholder="Name of product" 
            
            value={formdata.description}
            disabled 
            />
          </div>
          
          <div className="col-12">
            <label htmlFor="txt-description_full" className="form-label">Description large</label>
            <textarea className="form-control border-0" id="txt-description_full" rows="2" placeholder="large description use # if needed upto 3000 chars"
              value={formdata.description_full}
              disabled 
            ></textarea>
          </div> 

          <div className="col-md-4">
            <label htmlFor="num-price_sale" className="form-label">Price</label>
            <input type="number" className="form-control border-0" id="num-price_sale" placeholder="price in default currency" 
              value={formdata.price_sale}
              disabled    
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-price_sale1" className="form-label">Price 1</label>
            <input type="number" className="form-control border-0" id="num-price_sale1" placeholder="price in second currency" 
              value={formdata.price_sale1}
              disabled
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="num-order_by" className="form-label">Order</label>
            <input type="number" className="form-control border-0" id="num-order_by" 
              value={formdata.order_by}
              disabled            
            />
          </div>          

          <div className="col-md-6">
            <label htmlFor="sel-display" className="form-label">Display</label>
            <select id="sel-display" className="form-select border-0"
              value={formdata.display}
              disabled
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
              <img src={formdata.url_image} className="img-fluid" alt={formdata.url_image}/>
            </div>
          </div>

          <Sysfields formdata={formdata} />
          
          <div className="col-12">
            <SubmitAsync innertext="Clone" type="primary" issubmitting={issubmitting} />
          </div>

        </form>
      </main>
      <Footer />
    </>
  )
}

export default ProductClone;
