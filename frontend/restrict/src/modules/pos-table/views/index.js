import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KeyboardSecret from "components/bootstrap/app/keyboards/keyboard_secret"
import {async_ispinned} from "modules/login/login_index";
import HrefDom from "helpers/href_dom";
import {async_get_all_enabled_not_deleted} from "../async/async_repository";


function TableIndex() {
  const history = useHistory()

  const async_onload = async () => {
    console.log("app_table.index.async_onload")
    const ispinned = await async_ispinned()
    if(!ispinned){
      history.push("/admin")
      return
    }

    HrefDom.document_title("Admin | POS-Tables")
    const data = await async_get_all_enabled_not_deleted()
    console.log(data,"pos-tables")
    console.table(data.result)


  }

  useEffect(() => {
    async_onload()
    return () => console.log("login.insert.unmounting")
  },[])

  return (
      <>
        <Navbar />
        <main className="container">
          <div className="d-flex justify-content-center bd-highlight mt-2">

          </div>
        </main>
        <Footer />
      </>
  )
}

export default TableIndex;
