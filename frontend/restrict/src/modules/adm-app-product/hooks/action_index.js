import {useHistory, useParams} from "react-router-dom"
import {useCallback, useEffect, useReducer, useState} from "react"
import {async_get_list, async_multidelete, async_multideletelogic} from "../async/async_repository"
import {get_pages} from "helpers/functions"
import {grid, VIEWCONFIG} from "../async/queries/query_list"
import {async_is_pinned} from "modules/pos-login/async/login_checker"
import HrefDom from "helpers/href_dom"
import db from "helpers/localdb"
import {MODCONFIG} from "modules/adm-app-product/config/config"

const ACTIONS = {
  DELETE: "DELETE",
  DELETE_LOGIC: "DELETE_LOGIC"
}

const statesearch = {
  error: "",
  success: "",
  search: "",
  is_submitting: false,
  results: [],
  foundrows: 0,
}

const fnreducer = (state, action) => {
  switch(action.type) {
    case ACTIONS.DELETE:
      return {
        ...state,
        search: ""
      }

    case ACTIONS.UPDATE:
      return {
        ...state,
        search: action.payload
      }

    case ACTIONS.SUBMIT:
      return {
        ...state,
        is_submitting: action.payload
      }
    default:
      return state
  }
}

function ActionIndex(){

  const {page} = useParams()
  const history = useHistory()

  const [state, dispatch] = useReducer(fnreducer, statesearch)
  const [issubmitting, set_issubmitting] = useState(false)
  const [error,] = useState("")
  const [success, set_success] = useState("")
  const [txtsearch, set_txtsearch] = useState("")

  const [result, set_result] = useState([])
  const [foundrows, set_foundrows] = useState(0)

  const on_multiconfirm = keys => async straction => {
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

  const async_load_products = useCallback(async () =>{
    set_issubmitting(true)
    const r = await async_get_list(page, txtsearch)
    const ipages = get_pages(r.foundrows, VIEWCONFIG.PERPAGE)
    if(page>ipages) history.push(VIEWCONFIG.URL_PAGINATION.replace("%page%",1))

    set_issubmitting(false)
    set_result(r.result)
    set_foundrows(r.foundrows)
  },[txtsearch, page])


  useEffect(()=>{
    (async () => {
        const ispinned = await async_is_pinned()
        if (!ispinned) {
          history.push("/admin")
          return
        }

        HrefDom.document_title("Admin | Products")
        const search = db.select(VIEWCONFIG.CACHE_KEY)
        if (!txtsearch && search) {
          set_txtsearch(search)
          return
        }

        await async_load_products()
      })()
    return ()=> console.log("product.index unmounting")
  },[txtsearch, page])

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
    async_load_products,
    on_multiconfirm,
  }
}

export default ActionIndex