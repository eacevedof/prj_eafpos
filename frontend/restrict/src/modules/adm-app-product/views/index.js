import React from "react"
import {MODCONFIG} from "modules/adm-app-product/config/config"
import {VIEWCONFIG, grid} from "modules/adm-app-product/async/queries/query_list"
import ActionClone from "modules/adm-app-product/hooks/action_clone";

import Navbar from "components/common/navbar"
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import InputSearch from "components/bootstrap/input/inputsearch"
import Spinnergrow from "components/bootstrap/spinner/spinnergrow"
import TableProvider from "components/bootstrap/tableaction/tablecontext"
import TableAction from "components/bootstrap/tableaction/tableaction"
import PaginationSimple from "components/bootstrap/pagination/paginationsimple"
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Footer from "components/common/footer"

function ProductIndex() {

  const {
    page,
    foundrows,
    success,
    error,
    result,

    set_txtsearch,
    issubmitting,
    async_load_products,
    on_multiconfirm,

  } = ActionClone()

  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">Products</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>
        
        {success && <ToastSimple message={success} title="Success" isvisible={true}  />}
        {error && <ToastSimple message={error} title="Error" isvisible={true}  />}       
        
        <InputSearch cachekey={VIEWCONFIG.CACHE_KEY} fnsettext={set_txtsearch} foundrows={foundrows} />

        <PaginationSimple objconf={{page, foundrows, ippage:VIEWCONFIG.PERPAGE, url:VIEWCONFIG.URL_PAGINATION}} />
        
        {
          issubmitting ?
            <Spinnergrow type="info" />
          :
          <>
          <RefreshAsync issubmitting={issubmitting} onrefresh={async_load_products} />
          <TableProvider>
            <TableAction 
              arhead={grid.headers} 
              ardata={result} 
              objconf={VIEWCONFIG}
              multiconf={{ACTIONS:VIEWCONFIG.MULTIACTIONS, fnmultiaction:on_multiconfirm }} 
            />
          </TableProvider>
          </>
        }

        <PaginationSimple objconf={{page, foundrows, ippage:VIEWCONFIG.PERPAGE, url:VIEWCONFIG.URL_PAGINATION}} />
      </main>
      <Footer />
    </>
  )
}

export default ProductIndex;
