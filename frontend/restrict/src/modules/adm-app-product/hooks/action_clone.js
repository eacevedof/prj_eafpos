import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {async_get_list, async_multidelete, async_multideletelogic} from "../async/async_requests";
import {get_pages} from "helpers/functions";
import {VIEWCONFIG} from "../async/queries/query_list";
import {async_ispinned} from "../../login/async/login_checker";
import HrefDom from "helpers/href_dom";
import db from "helpers/localdb";

function ActionClone(){
  const {page} = useParams()
  const history = useHistory()

  const [issubmitting, set_issubmitting] = useState(false)
  const [error,] = useState("")
  const [success, set_success] = useState("")
  const [txtsearch, set_txtsearch] = useState("")

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
    const ispinned = await async_ispinned()

    if(!ispinned){
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

  return {
    page,
    foundrows,
    success,
    error,
    result,

    set_txtsearch,
    issubmitting,
    async_load_products,
    on_multiconfirm,
  }
}

export default ActionClone