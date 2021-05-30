import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import {async_ispinned} from "modules/login/login_index";
import HrefDom from "helpers/href_dom";
import {async_get_all_enabled_not_deleted} from "../async/async_repository";


function TableIndex() {
  const history = useHistory()
  const [tables, set_tables] = useState([])

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
    set_tables(data.result)

  }

  useEffect(() => {
    async_onload()
    return () => console.log("login.insert.unmounting")
  },[])

  //const get_tds = ar => ar.map( (objth,i) => <td key={i} scope="col">{objth.text}</td>) // get_tds
  const get_div_cols = obj => Object.keys(obj).map( (objth,i) => <div className="col">{i}</div>) // get_tds

  return (
      <>
        <Navbar />
        <main className="container">
          {tables.map( (row, i) => <div className="row">{get_div_cols(row)}</div>)}
        </main>
        <Footer />
      </>
  )
}

export default TableIndex;
