import React from "react"
import {is_empty, is_defined} from "helpers/functions"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import Footer from "components/common/footer"
import ActionInsert from "modules/adm-app-product/hooks/action_insert"

function ProductInsert() {

  const {
    success, error, refcode, formdata,
    scrumbs, updateform, seldisplay, issubmitting,
    on_submit, maxsize
  } = ActionInsert()

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Product insert</h1>
        <Breadscrumb urls={scrumbs}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success && <AlertSimple message={success} type="success" />}
          {error && <AlertSimple message={error} type="danger" />}

          {success && <ToastSimple message={success} title="Success" isvisible={true} />}
          {error && <ToastSimple message={error} title="Error" isvisible={true} />}

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
              <option defaultValue>Choose...</option>
              {
                seldisplay.map(obj => (<option key={obj.value} value={obj.value}>{obj.text}</option>))
              }
            </select>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="file-url_image" className="form-label">Picture: </label>
              <input type="file" className="form-control" id="file-url_image" 
                onChange={updateform}
              />
              <small>max: {maxsize}</small>
              {
                !is_empty(formdata.url_image) && is_defined(formdata.url_image.name) ?
                (<ul>
                  <li><small>filename: {formdata.url_image.name}</small></li>
                  <li><small>size: {formdata.url_image.size}</small></li>
                </ul>)
                :null
              }
            </div>
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

export default ProductInsert;
