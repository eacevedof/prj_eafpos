import React, {useEffect, useState, useRef} from 'react';

import db from "helpers/localdb" 
import SubmitAsync from 'components/bootstrap/button/submitasync';
import { pr } from 'helpers/functions';


function InputSearch({cachekey, fnsettext, foundrows}){
  
  const [issubmitting, set_issubmitting] = useState(false)
  const [formdata, set_formdata] = useState({search:""})
  const refsearch = useRef(null)

  const updateform = evt =>{
    const elem = evt.target
    set_formdata({search:elem.value})
    console.log("inputsearch.updateform.formdata",formdata)
  }

  const reset = evt => {
    set_formdata({search:""})
    fnsettext("")
    refsearch.current.focus()
    db.save(cachekey, "")
  }

  const on_submit = async evt => {
    console.log("inputsearch.on_submit.formdata:",formdata)
    evt.preventDefault()

    set_issubmitting(true)
    fnsettext(formdata.search)
    refsearch.current.focus()
    db.save(cachekey, formdata.search)
    set_issubmitting(false)
    
  }// on_submit

  useEffect(() => {
    console.log("inputsearch.on_load")
    const search = db.select(cachekey)
    //if(search){
      //console.log("inputsearch.useeffect search cache:",search)
      //set_formdata({search})
      //fnsettext(search)
    //}
    //pr(text)
    set_formdata({search})
      
    return ()=> console.log("inputsearch unmounting")
  },[])  


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
