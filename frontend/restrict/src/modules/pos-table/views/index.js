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
    console.table(data.result)
    set_tables(data.result)

  }

  useEffect(() => {
    async_onload()
    return () => console.log("login.insert.unmounting")
  },[])

  const render = () => {
    const elements = []
    const tmp = [...tables]

    const get_xy = (tables, x,y) => tables
        .filter( row => parseInt(row.coord_x) === x && parseInt(row.coord_y) === y)[0] ?? null

    const CELLS = 10

    for(let x=0; x<CELLS; x++) {
      for(let y=0; y<CELLS; y++) {
        if(!tmp) return elements
        const otable = get_xy(tmp, x, y)
        if(otable) {
          tmp.shift()
          elements.push(
            <div key={get_uuid()}>
              <button type="button" className={`btn pos-btn-table ${otable.btn_state}`}>
              {otable.code_erp}
              </button>
              <sub>{otable.user}</sub><br/>
              <sub>{otable.time_passed} min</sub>
            </div>
          )
        }
        else {
          elements.push(
            <div key={get_uuid()}>
              <sub className="coord">({x},{y})</sub>
            </div>
          )
        }
      }
    }

    console.log(elements)
    return elements
  }

  return (
      <>
        <Navbar />
        <h2 className="h2 text-center">Tables</h2>
        <div className="table-grid">
        {render()}
        </div>
        <Footer />
      </>
  )
}

export default TableIndex;
