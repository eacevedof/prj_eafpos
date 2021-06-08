import React from "react"
import Navbar from "components/common/navbar"
import AlertSimple from "components/bootstrap/alert/alertsimple"
import Breadscrumb from "components/bootstrap/breadscrumb/breadscrumb"
import RefreshAsync from "components/bootstrap/button/refreshasync"
import SubmitAsync from "components/bootstrap/button/submitasync"
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"
import ActionClone from "modules/zzz-tpl/hooks/action_clone";

function ZzzTplClone(){

  const {refcode, scrumbs} = ActionClone()
  const {error, success} = ActionClone()
  const {formdata, on_submit} = ActionClone()
  const {issubmitting} = ActionClone()
  const {async_refresh} = ActionClone()
  
  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">Tpl clone</h1>
        <Breadscrumb urls={scrumbs}/>

        <form className="row g-3" onSubmit={on_submit}>
          {success && <AlertSimple message={success} type="success"/>}
          {error && <AlertSimple message={error} type="danger"/>}

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
          
          %FORM_CLONE%
          
          <Sysfields sysdata={formdata} />
          
          <div className="col-12">
            <SubmitAsync innertext="Clone" type="primary" issubmitting={issubmitting} />
          </div>

        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplClone;
