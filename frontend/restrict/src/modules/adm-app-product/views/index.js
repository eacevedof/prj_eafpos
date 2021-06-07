import React from "react"
import  ActionIndex from "modules/adm-app-product/hooks/action_index";

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

  const { scrumbs, cachekey } =  ActionIndex()
  const { error, success} =  ActionIndex()
  const {async_load_products, on_multiconfirm} =  ActionIndex()
  const { result, foundrows} =  ActionIndex()

  const {
    urlpagination,
    perpage,
    page,
    headers,
    viewconfig,

    set_txtsearch,
    issubmitting,
  } =  ActionIndex()

  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">Products</h1>
        <Breadscrumb urls={scrumbs}/>
        
        {success && <ToastSimple message={success} title="Success" isvisible={true}  />}
        {error && <ToastSimple message={error} title="Error" isvisible={true}  />}       
        
        <InputSearch cachekey={cachekey} fnsettext={set_txtsearch} foundrows={foundrows} />

        <PaginationSimple objconf={{page, foundrows, ippage:perpage, url:urlpagination}} />
        
        {
          issubmitting ?
            <Spinnergrow type="info" />
          :
          <>
          <RefreshAsync issubmitting={issubmitting} onrefresh={async_load_products} />
          <TableProvider>
            <TableAction 
              arhead={headers}
              ardata={result} 
              objconf={viewconfig}
              multiconf={{ACTIONS:viewconfig.MULTIACTIONS, fnmultiaction:on_multiconfirm }}
            />
          </TableProvider>
          </>
        }

        <PaginationSimple objconf={{page, foundrows, ippage:perpage, url:urlpagination}} />
      </main>
      <Footer />
    </>
  )
}

export default ProductIndex;
