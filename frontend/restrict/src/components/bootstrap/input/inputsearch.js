import React, {useEffect, useRef, useCallback, memo, useReducer} from "react"
import db from "helpers/localdb"
import SubmitAsync from "components/bootstrap/button/submitasync"

const ACTIONS = {
  RESET: "RESET",
  UPDATE: "UPDATE",
  SUBMIT: "SUBMIT"
}

const statesearch = {
  is_submitting: false,
  search: ""
}

const fnreducer = (state, action) => {
  switch(action.type) {
    case ACTIONS.RESET:
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

function InputSearch({cachekey, fnsettext, foundrows}){

  const [state, dispatch] = useReducer(fnreducer, statesearch)
  const refsearch = useRef(null)

  const reset = useCallback(() => {
    dispatch({type: ACTIONS.RESET})
    fnsettext("")
    refsearch.current.focus()
    db.save(cachekey, "")
  },[fnsettext])

  const on_submit = useCallback(async evt => {
    evt.preventDefault()
    dispatch({type:ACTIONS.SUBMIT, payload: true})
    console.log("state.search",state.search)
    fnsettext(state.search)
    refsearch.current.focus()
    db.save(cachekey, state.search)
    dispatch({type:ACTIONS.SUBMIT, payload: false})
  }, [state.search, fnsettext])

  useEffect(() => {
    const search = db.select(cachekey) ?? ""
    dispatch({type: ACTIONS.UPDATE, payload: search})
    return () => console.log("inputsearch unmounting")
  },[cachekey, fnsettext])

  return (
    <form className="row" onSubmit={on_submit}>
      <div className="col-8">
        <input type="text" className="form-control" aria-describedby="search" placeholder="filter"
          ref={refsearch}
          value={state.search}
          onChange={ event => dispatch({ type: ACTIONS.UPDATE, payload: event.target.value }) }
        />
        <div className="form-text">
          regs: {foundrows}
        </div>
      </div>
      <div className="col-2 col-md-2 col-lg-1">
        <SubmitAsync innertext="Search" type="primary" issubmitting={state.is_submitting} />
      </div>      
      <div className="col-1">
        <button type="button" className="btn btn-secondary" onClick={reset}>
          <i className="fa fa-eraser" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  )
}

export default memo(InputSearch)
