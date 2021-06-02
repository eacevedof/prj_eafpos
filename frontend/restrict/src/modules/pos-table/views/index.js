import React, {useEffect, useState} from "react"
import {NavLink, useHistory} from "react-router-dom"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import {async_ispinned} from "modules/login/login_index";
import HrefDom from "helpers/href_dom";
import {async_get_all_enabled_not_deleted} from "../async/async_repository";
import { get_uuid } from "helpers/functions"
import "modules/common/pos_table.css"
import RefreshAsync, {refreshasync} from "components/bootstrap/button/refreshasync"

function TableIndex() {
  const history = useHistory()
  const [tables, set_tables] = useState([])
  const [issubmitting, set_issubmitting] = useState(false)

  const async_onload = async () => {
    console.log("app_table.index.async_onload")
    const ispinned = await async_ispinned()
    if(!ispinned){
      history.push("/")
      return
    }

    HrefDom.document_title("Admin | POS-Tables")
    refresh()
  }

  const refresh = async () => {
    set_issubmitting(true)
    const data = await async_get_all_enabled_not_deleted()
    //console.table(data.result)
    set_tables(data.result)
    set_issubmitting(false)
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
              <ul className="ul-data">
                <li>{otable.user}</li>
                <li>{otable.time_passed} min</li>
              </ul>
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
        <h2 className="h2 text-center">POS Tables</h2>
        <div className="buttons-grid">
          <NavLink className="btn-lg btn-primary" exact to={"/admin"}>POS</NavLink>
          <RefreshAsync issubmitting={issubmitting} fnrefresh={refresh} css="btn-lg btn-dark" />
        </div>
        <div className="pos-table-grid">
        {render()}
        </div>
        <Footer />
      </>
  )
}

export default TableIndex;
