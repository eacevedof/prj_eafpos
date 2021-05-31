import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import {async_ispinned} from "modules/login/login_index";
import HrefDom from "helpers/href_dom";
import {async_get_all_enabled_not_deleted} from "../async/async_repository";
import { get_uuid } from "helpers/functions"
import "modules/common/pos.css"

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

  const get_xy = (tables, x,y) => tables
      .filter( row => parseInt(row.coord_x) === x && parseInt(row.coord_y) === y)
      .map( row => JSON.stringify(row))
      .join(" ")

  const render_button = row => row ?(<button type="button" className="btn btn-dark pos-btn-lg">
    {row.code_erp}
  </button>):null

  return (
      <>
        <Navbar />
        <main className="container">
          {[...Array(10).keys()].map(x =>
              <div key={get_uuid()} className="row">
                {[...Array(10).keys()].map(y =>
                    <div key={get_uuid()}  className="col">{render_button(get_xy(tables,x,y))}</div>)
                }
              </div>)
          }
        </main>
        <Footer />
      </>
  )
}

export default TableIndex;
