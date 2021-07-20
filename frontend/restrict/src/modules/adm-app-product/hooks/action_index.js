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
  LOAD: "LOAD",
  DELETE: "DELETE",
  DELETE_LOGIC: "DELETE_LOGIC",
  SUBMIT: "SUBMIT",
  SEARCH: "SEARCH",
}

const stateindex = {
  error: "",
  success: "",
  txtsearch: "",
  is_submitting: false,
  result: [],
  foundrows: 0,
}

const fnreducer = (state, action) => {
  switch(action.type) {
    case ACTIONS.LOAD:
      return {
        ...state,
        ...action.payload
      }
    case ACTIONS.SUBMIT:
      return {
        ...state,
        is_submitting: action.payload
      }
    case ACTIONS.DELETE:
    case ACTIONS.DELETE_LOGIC:
      return {
        ...state,
        success: action.payload
      }
    case ACTIONS.SEARCH:
      return {
        ...state,
        txtsearch: action.payload
      }
    default:
      return state
  }
}

function ActionIndex(){

  const {page} = useParams()
  const history = useHistory()

  const [state, dispatch] = useReducer(fnreducer, stateindex)

  const on_multiconfirm = keys => async straction => {
    switch(straction){
      case "delete":
        await async_multidelete(keys)
        dispatch({type: ACTIONS.DELETE, payload: "products deleted: ".concat(keys.toString())})
        //set_success("products deleted: ".concat(keys.toString()))
        break
      case "deletelogic":
        await async_multideletelogic(keys)
        dispatch({type: ACTIONS.DELETE_LOGIC, payload: "products deleted: ".concat(keys.toString())})
        //set_success("products deleted: ".concat(keys.toString()))
        break
    }
    await async_load_products()
  }

  const async_load_products = useCallback(async () =>{
    dispatch({type: ACTIONS.SUBMIT, payload: true})
    const result = await async_get_list(page, state.txtsearch)

    const ipages = get_pages(result.foundrows, VIEWCONFIG.PERPAGE)
    if(page>ipages) history.push(VIEWCONFIG.URL_PAGINATION.replace("%page%",1))

    dispatch({type: ACTIONS.LOAD, payload: {
      is_submitting: false,
      ...result
    }})
    //set_result(result.result)
    //set_foundrows(r.foundrows)
  },[state.txtsearch, page])


  useEffect(()=>{
    (async () => {
        const ispinned = await async_is_pinned()
        if (!ispinned) {
          history.push("/admin")
          return
        }

        HrefDom.document_title("Admin | Products")
        const search = db.select(VIEWCONFIG.CACHE_KEY)
        if (!state.txtsearch && search) {
          dispatch({type: ACTIONS.LOAD, payload: {
              txtsearch: search
            }})
          return
        }

        await async_load_products()
      })()
    return ()=> console.log("product.index unmounting")
  },[state.txtsearch, page])

  return {
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    cachekey: VIEWCONFIG.CACHE_KEY,
    perpage: VIEWCONFIG.PERPAGE,
    urlpagination: VIEWCONFIG.URL_PAGINATION,
    headers: grid.headers,
    viewconfig: VIEWCONFIG,

    page,
    foundrows: state.foundrows,
    success: state.success,
    error: state.error,
    result: state.result,

    set_txtsearch: value => dispatch({type:ACTIONS.SEARCH, payload: value}),
    issubmitting: state.is_submitting,
    async_load_products,
    on_multiconfirm,
  }
}

export default ActionIndex