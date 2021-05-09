import React, {useState, useEffect, useRef} from 'react';
import {async_get_one_by_tpvcode} from "modules/login/async/async_requests"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KbNumbers from "components/bootstrap/app/kb-numbers/kb_numbers"

function LoginInsert() {

  const [issubmitting, set_issubmitting] = useState(false)
  const [maxsize, set_maxsize] = useState(0)
  const [error, set_error] = useState("")
  const [success, set_success] = useState("")
  const refcode = useRef(null)

  const on_submit = async (evt)=>{
    evt.preventDefault()
    set_issubmitting(true)
    set_error("")
    set_success("")

    try {
      refcode.current.focus()
    } 
    catch (error) {
      set_error(error)
    } 
    finally {
      set_issubmitting(false)
    }
    
  }// on_submit


  const on_ok = async () => {
    const r = await async_get_one_by_tpvcode()
    console.log("on_ok.r",r)
  }

  useEffect(()=>{
    console.log("login.insert.useeffect")
    return ()=> console.log("login.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">
        <div className="d-flex justify-content-center bd-highlight mt-2">
          <h1 className="">Access code</h1>
          <KbNumbers onok={on_ok}/>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LoginInsert;
