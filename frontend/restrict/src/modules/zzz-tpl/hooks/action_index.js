import {useEffect} from "react"
import {useParams, useHistory} from "react-router-dom"
import {MODCONFIG} from "modules/zzz-tpl/config/config"
import { get_pages } from "helpers/functions"
import db from "helpers/localdb"
import HrefDom from "helpers/href_dom"
import {async_is_tokenized} from "modules/login/async/login_checker"
import {async_get_list, async_multidelete, async_multideletelogic} from "modules/zzz-tpl/async/async_repository"
import {VIEWCONFIG, grid} from "modules/zzz-tpl/async/queries/query_list"


function ActionIndex(){
  const {page} = useParams()
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [txtsearch, set_txtsearch] = useState("")

  const history = useHistory()
  const [result, set_result] = useState([])
  const [foundrows, set_foundrows] = useState(0)

  const on_multiconfirm = keys => async straction => {
    switch(straction){
      case "delete":
        await async_multidelete(keys)
        set_success("Tpls deleted: ".concat(keys.toString()))
        break
      case "deletelogic":
        await async_multideletelogic(keys)
        set_success("Tpls deleted: ".concat(keys.toString()))
        break
    }
    await async_load_tpls()
  }

  async function async_load_tpls(){
    set_issubmitting(true)
    const r = await async_get_list(page, txtsearch)
    const ipages = get_pages(r.foundrows, VIEWCONFIG.PERPAGE)
    if(page>ipages) history.push(VIEWCONFIG.URL_PAGINATION.replace("%page%",1))

    set_issubmitting(false)
    set_result(r.result)
    set_foundrows(r.foundrows)
  }

  const async_onload = async () => {
    console.log("zzz_tpl.index.async_onload")
    const islogged = await async_is_tokenized()

    if(!islogged){
      history.push("/admin")
      return
    }

    HrefDom.document_title("Admin | Tpls")
    const search = db.select(VIEWCONFIG.CACHE_KEY)
    if(!txtsearch && search){
      set_txtsearch(search)
      return
    }

    await async_load_tpls()
  }

  useEffect(()=>{
    async_onload()
    return ()=> console.log("zzz_tpl.index unmounting")
  },[page, txtsearch])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    cachekey: VIEWCONFIG.CACHE_KEY,
    perpage: VIEWCONFIG.PERPAGE,
    urlpagination: VIEWCONFIG.URL_PAGINATION,
    headers: grid.headers,
    viewconfig: VIEWCONFIG,

    page,
    foundrows,
    success,
    error,
    result,

    set_txtsearch,
    issubmitting,
    async_load_tpls,
    on_multiconfirm,
  }
}

export default ActionIndex