import React, {useEffect, useState, useCallback} from "react"
import {NavLink, useHistory} from "react-router-dom"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import {async_is_pinned} from "modules/pos-login/async/login_checker";
import HrefDom from "helpers/href_dom";
import {async_get_all_enabled_not_deleted} from "../async/async_repository";
import { get_uuid } from "helpers/functions"
import RefreshAsync from "components/bootstrap/button/refreshasync"
import ModalClassic from "components/bootstrap/modal/modalclassic"
import "modules/common/pos_table.css"

const render = (tables, onclick) => {
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
              <button type="button" className={`btn pos-btn-table ${otable.btn_state}`}
                      onClick={onclick}
              >
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

  return elements
}

function TableIndex() {
  const history = useHistory()
  const [tables, set_tables] = useState([])
  const [issubmitting, set_issubmitting] = useState(false)
  const [isvisible, set_isvisible] = useState(false)

  const async_onload = useCallback(async () => {
    console.log("app_table.index.async_onload")
    const ispinned = await async_is_pinned()
    if(!ispinned){
      history.push("/")
      return
    }

    HrefDom.document_title("Admin | POS-Tables")
    await async_refresh()
  },[])

  const async_refresh = async () => {
    set_issubmitting(true)
    const data = await async_get_all_enabled_not_deleted()
    set_tables(data.result)
    set_issubmitting(false)
  }

  const on_click = () => {
    console.log("on click")
    set_isvisible(true)
  }

  const on_accept = value => {
    console.log("table.accept.value",value)
    set_isvisible(false)
  }

  const on_close = () => {
    console.log("on_close")
    set_isvisible(false)
  }

  useEffect(() => {
    async_onload()
    return () => console.log("pos-login.insert.unmounting")
  },[async_onload])

  return (
    <>
      <Navbar />
      <h2 className="h2 text-center">POS Tables</h2>
      <div className="buttons-grid">
        <NavLink className="btn btn-lg btn-primary" exact to={"/pos"}>
          <i className="fa fa-desktop"></i>&nbsp;&nbsp;POS
        </NavLink>
        <RefreshAsync issubmitting={issubmitting} onrefresh={async_refresh} css="btn-lg btn-dark" />
      </div>
      <div className="pos-table-grid">
      {render(tables, on_click)}
      </div>
      <ModalClassic isvisible={isvisible} onaccept={on_accept} onclose={on_close} />
      <Footer />
    </>
  )
}

export default TableIndex;
