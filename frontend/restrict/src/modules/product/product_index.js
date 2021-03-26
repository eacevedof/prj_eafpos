import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from "react-router-dom"
import {MODCONFIG} from "modules/product/config/config"

import { pr, get_pages } from 'helpers/functions';
import db from "helpers/localdb" 
import HrefDom from "helpers/href_dom"

import {async_islogged} from 'modules/login/login_index'
import {async_get_list, async_multidelete, async_multideletelogic} from "modules/product/async/async_requests"

import {VIEWCONFIG, grid} from "modules/product/async/queries/query_list"

import Navbar from "components/common/navbar"
import AlertSimple from 'components/bootstrap/alert/alertsimple'
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

  const {page} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [txtsearch, set_txtsearch] = useState("")
  
  const history = useHistory()
  const [result, set_result] = useState([])
  const [foundrows, set_foundrows] = useState(0)
 
  const on_multiconfirm = keys => async straction => {
    //pr(straction,"straction")
    switch(straction){
      case "delete": 
        await async_multidelete(keys)
        set_success("products deleted: ".concat(keys.toString())) 
      break
      case "deletelogic":
         await async_multideletelogic(keys)
         set_success("products deleted: ".concat(keys.toString())) 
      break
    }
    await async_load_products()
  }

  async function async_load_products(){
    set_issubmitting(true)
    const r = await async_get_list(page, txtsearch)    
    //pr(r.foundrows)
    //pr(r.result)
    const ipages = get_pages(r.foundrows, VIEWCONFIG.PERPAGE)
    //alert(page)
    if(page>ipages) history.push(VIEWCONFIG.URL_PAGINATION.replace("%page%",1))
    
    set_issubmitting(false)
    set_result(r.result)
    set_foundrows(r.foundrows)
  }

  const async_onload = async () => {
    //pr(txtsearch)
    //pr(get_localip(),"localip")
    console.log("product.index.async_onload")
    const islogged = await async_islogged()
    
    if(!islogged){
      history.push("/admin")
      return
    }

    HrefDom.document_title("Admin | Products")    
    const search = db.select(VIEWCONFIG.CACHE_KEY)
    if(!txtsearch && search){
      set_txtsearch(search)
      return
    }
    
    await async_load_products()
  }

  useEffect(()=>{
    //https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
    async_onload()

    return ()=> console.log("product.index unmounting")
  },[page, txtsearch])
  
  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">Products</h1>
        <Breadscrumb urls={MODCONFIG.SCRUMBS.GENERIC}/>
        
        {success!==""? <ToastSimple message={success} title="Success" isvisible={true} />: null}
        {error!==""? <ToastSimple message={error} title="Error" isvisible={true} />: null}       
        
        <InputSearch cachekey={VIEWCONFIG.CACHE_KEY} fnsettext={set_txtsearch} foundrows={foundrows} />

        <PaginationSimple objconf={{page, foundrows, ippage:VIEWCONFIG.PERPAGE, url:VIEWCONFIG.URL_PAGINATION}} />
        
        {
          issubmitting ?
            <Spinnergrow type="info" />
          :
          <>
          <RefreshAsync issubmitting={issubmitting} fnrefresh={async_load_products} />
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
