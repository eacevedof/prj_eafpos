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
  const [issubmitting, set_issubmitting] = useState(false)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const [formdata, set_formdata] = useState(formdefault)

  const {id} = useParams()
  const refcode = useRef(null)
  const history = useHistory()

  const async_onload = useCallback(async () => {
    dispatch({type:ACTIONS.SUBMIT})
    try {
      const r = await async_get_by_id(id)
      const temp = {...formdata, ...r}
      dispatch({type:ACTIONS.LOAD, payload:temp})
    }
    catch (error){
      dispatch({type:ACTIONS.ERROR, payload:error})
    }
  },[])// async_onload

  const async_refresh = async () => await async_onload()

  const before_submit = () => {}

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    dispatch({type: ACTIONS.SUBMIT})

    try {
      before_submit()
      const r = await async_clone(formdata)
      dispatch({type:ACTIONS.SUCCESS, payload:"Product cloned. Nº: ".concat(r)})
      history.push("/admin/products")
    }
    catch (error) {
      dispatch({type:ACTIONS.ERROR, payload:error})
    }
  },[formdata])//on_submit

  useEffect(()=>{
    async_onload()
    return ()=> console.log("product.clone unmounting")
  }, [state.formdata])

  return {
    success,
    error,

    issubmitting,
    scrumbs: MODCONFIG.SCRUMBS.GENERIC,
    formdata,
    refcode,
    seldisplay,

    async_refresh,
    on_submit,
  }//return

}

export default ActionClone