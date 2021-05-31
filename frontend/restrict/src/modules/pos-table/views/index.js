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
      .filter( row => parseInt(row.coord_x) === x && parseInt(row.coord_y) === y)[0] ?? null
      //.map( row => JSON.stringify(row))
      //.join(" ")

  const render_button = row => row.code_erp ?(<button type="button" className="btn btn-dark pos-btn-table">
    {row.code_erp}
  </button>):null

  const render = () => {
    const elements = []
    let remove = null
    const get = (rows, x, y) => rows.filter((row, i)=>{
      if(parseInt(row.coord_x) === x && parseInt(row.coord_y) === y){
        remove = i
        return true
      }
      return false
    })

    const tmp = [...tables]
    console.log("tmp", tmp)
    for(let x=0; x<10; x++) {
      for(let y=0; y<10; y++) {
        if(!tmp) return elements
        const row = get_xy(tmp, x, y)
        if(row) {
          tmp.shift()
          console.log("tmp.length",tmp.length, "x",x,"y",y)
          elements.push(<div key={get_uuid()}>{row.code_erp}</div>)
        }
        else {
          elements.push(<div key={get_uuid()}></div>)
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