import {useHistory, useParams} from "react-router-dom"
import {useCallback, useEffect, useReducer, useRef, useState} from "react"
import {async_clone, async_get_by_id} from "modules/adm-app-product/async/async_repository"

import {MODCONFIG} from "modules/adm-app-product/config/config"
import {seldisplay} from "modules/common/options"

const ACTIONS = {
  LOAD: "LOAD",
  SUBMIT: "SUBMIT",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
}

const statedefault = {
  error: "",
  success: "",
  is_submitting: false,

  formdata: {
    insert_user:"",
    insert_date:"",
    update_date:"",
    update_user:"",

    id: -1,
    code_erp:"",
    description:"",
    slug:"",

    description_full:"",
    price_sale:"0",
    price_sale1:"0",
    order_by:"100",
    display:"0",
    url_image: "",
    id_user:1,    
  }
}

const fnreducer = (state, action) => {
  switch(action.type) {
    case ACTIONS.LOAD:
      return {
        ...state,
        is_submitting: false,
        formdata: {
          ...state.formdata,
          ...action.payload
        }
      }
    case ACTIONS.SUBMIT:
      return {
        ...state,
        is_submitting: true,
        error: "",
        success: "",
      }
    case ACTIONS.SUCCESS:
      return {
        ...state,
        is_submitting: false,
      }
    case ACTIONS.ERROR:
      return {
        ...state,
        is_submitting: false,
        error: action.payload,
      }
    default:
      return state
  }
}

function ActionClone() {

  const [state, dispatch] = useReducer(fnreducer, statedefault)
  const {id} = useParams()
  const refcode = useRef(null)
  const history = useHistory()

  const async_onload = useCallback(async () => {
    dispatch({type:ACTIONS.SUBMIT})
    try {
      const fields = await async_get_by_id(id)
      const temp = {...state.formdata, ...fields}
      dispatch({type:ACTIONS.LOAD, payload:temp})
    }
    catch (error){
      dispatch({type:ACTIONS.ERROR, payload:error})
    }
  },[id])// async_onload

  const async_refresh = useCallback(async () => await async_onload(),[])

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    dispatch({type: ACTIONS.SUBMIT})

    try {
      const r = await async_clone(state.formdata)
      dispatch({type:ACTIONS.SUCCESS, payload:"Product cloned. Nº: ".concat(r)})
      history.push("/admin/products")
    }
    catch (error) {
      dispatch({type:ACTIONS.ERROR, payload:error})
    }
  },[state.formdata])//on_submit

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.clone unmounting")
  }, [async_onload])

  return {
    success: state.success,
    error: state.error,

    issubmitting: state.is_submitting,
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    formdata: state.formdata,
    refcode,
    seldisplay,
    async_refresh,
    on_submit,
  }//return

}

export default ActionClone