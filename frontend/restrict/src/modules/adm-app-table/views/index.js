import React, {useState, useEffect} from "react"
import {useParams, useHistory} from "react-router-dom"
import {MODCONFIG} from "modules/adm-app-table/config/config"

import { get_pages } from "helpers/functions"
import db from "helpers/localdb" 
import HrefDom from "helpers/href_dom"

import {async_is_tokenized} from "modules/pos-login/async/login_checker"
import {async_get_list, async_multidelete, async_multideletelogic} from "modules/adm-app-table/async/async_repository"

import {VIEWCONFIG, grid} from "modules/adm-app-table/async/queries/query_list"

import Navbar from "components/common/navbar"
import ToastSimple from 'components/bootstrap/toast/toastsimple'
import InputSearch from "components/bootstrap/input/inputsearch"
import Spinnergrow from "components/bootstrap/spinner/spinnergrow"
import AppTableProvider from "components/bootstrap/tableaction/tablecontext"
import AppTableAction from "components/bootstrap/tableaction/tableaction"
import PaginationSimple from "components/bootstrap/pagination/paginationsimple"
import Breadscrumb from 'components/bootstrap/breadscrumb/breadscrumb'
import RefreshAsync from 'components/bootstrap/button/refreshasync'
import Footer from "components/common/footer"

function AppTableIndex() {

  const {page} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error,] = useState("")
  const [success, set_success] = useState("")
  const [txtsearch, set_txtsearch] = useState("")
  
  const history = useHistory()
  const [result, set_result] = useState([])
  const [foundrows, set_foundrows] = useState(0)
 
  const on_multiconfirm = keys => async straction => {
    switch(straction){
      case "delete": 
        await async_multidelete(keys)
        set_success("Tables deleted: ".concat(keys.toString()))
      break
      case "deletelogic":
         await async_multideletelogic(keys)
         set_success("Tables deleted: ".concat(keys.toString()))
      break
    }
    await async_load_tables()
  }

  async function async_load_tables(){
    set_issubmitting(true)
    const r = await async_get_list(page, txtsearch)    
    const ipages = get_pages(r.foundrows, VIEWCONFIG.PERPAGE)
    if(page>ipages) history.push(VIEWCONFIG.URL_PAGINATION.replace("%page%",1))
    
    set_issubmitting(false)
    set_result(r.result)
    set_foundrows(r.foundrows)
  }

  const async_onload = async () => {
    console.log("app_table.index.async_onload")
    const islogged = await async_is_tokenized()
    if(!islogged){
      history.push("/")
      return
    }

    HrefDom.document_title("Admin | Tables")
    const search = db.select(VIEWCONFIG.CACHE_KEY)
    if(!txtsearch && search){
      set_txtsearch(search)
      return
    }
    
    await async_load_tables()
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("app_table.index unmounting")
  },[page, txtsearch])
  
  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="mt-2 mb-2">Tables</h1>
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
          <RefreshAsync issubmitting={issubmitting} onrefresh={async_load_tables} />
          <AppTableProvider>
            <AppTableAction 
              arhead={grid.headers} 
              ardata={result} 
              objconf={VIEWCONFIG}
              multiconf={{ACTIONS:VIEWCONFIG.MULTIACTIONS, fnmultiaction:on_multiconfirm }} 
            />
          </AppTableProvider>
          </>
        }

        <PaginationSimple objconf={{page, foundrows, ippage:VIEWCONFIG.PERPAGE, url:VIEWCONFIG.URL_PAGINATION}} />
      </main>
      <Footer />
    </>
  )
}

export default AppTableIndex;
