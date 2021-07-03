import React from "react"
import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import SubmitAsync from 'components/bootstrap/button/submitasync'
import Sysfields from "components/common/sysfields"
import Footer from "components/common/footer"
import ActionDelete from "modules/zzz-tpl/hooks/action_delete"

function ZzzTplDelete(){

  const {error, success} = ActionDelete()
  const {isdeleted, issubmitting} = ActionDelete()
  const {scrumbs, formdata, async_refresh} = ActionDelete()

  return (
    <>
      <Navbar />
      <main className="container">
        
        <h1 className="mt-2 mb-2">ZzzTpl delete</h1>
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
          {
            isdeleted ? null:(
              <div className="col-md-3">
                <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} />
              </div>
            )
          }

          %FORM_DELETE%

          <Sysfields formdata={formdata} />
          {
            isdeleted ? null:(
              <div className="col-12">
                <SubmitAsync innertext="Delete" type="danger" issubmitting={issubmitting} />
              </div>   
            )
          }
        </form>
      </main>
      <Footer />
    </>
  )
}

export default ZzzTplDelete;
