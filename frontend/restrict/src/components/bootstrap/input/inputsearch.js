import React, {useEffect, useState, useRef, useCallback} from "react"
import db from "helpers/localdb"
import SubmitAsync from "components/bootstrap/button/submitasync"

function InputSearch({cachekey, fnsettext, foundrows}){
  
  const [issubmitting, set_issubmitting] = useState(false)
  const [formdata, set_formdata] = useState({search:""})
  const refsearch = useRef(null)

  const updateform = useCallback(evt => {
    const elem = evt.target
    set_formdata({search: elem.value})
  }, [])

  const reset = evt => {
    set_formdata({search:""})
    fnsettext("")
    refsearch.current.focus()
    db.save(cachekey, "")
  }

  const on_submit = useCallback(async evt => {
    evt.preventDefault()

    set_issubmitting(true)
    fnsettext(formdata.search)
    refsearch.current.focus()
    db.save(cachekey, formdata.search)
    set_issubmitting(false)
    
  }, [cachekey, fnsettext])// on_submit

  useEffect(() => {
    const search = db.select(cachekey) ?? ""
    set_formdata({search})
    return () => console.log("inputsearch unmounting")
  },[cachekey])

  return (
    <form className="row" onSubmit={on_submit}>
      <div className="col-8">
        <input type="text" className="form-control" aria-describedby="search" placeholder="filter" 
          
          ref={refsearch}
          value={formdata.search}
          onChange={updateform}        
        />
        <div className="form-text">
          regs: {foundrows}
        </div>
      </div>
      <div className="col-2 col-md-2 col-lg-1">
        <SubmitAsync innertext="Search" type="primary" issubmitting={issubmitting} />
      </div>      
      <div className="col-1">
        <button type="button" className="btn btn-secondary" onClick={reset}><i className="fa fa-eraser" aria-hidden="true"></i></button>
      </div>
    </form>
  )
}

export default InputSearch;
