import React, {useState, useEffect, useRef} from 'react';
import {async_get_one_by_tpvcode} from "modules/login/async/async_requests"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KbNumbers from "components/bootstrap/app/kb-numbers/kb_numbers"

function LoginInsert() {

  const on_submit = async code => {
    const r = await async_get_one_by_tpvcode(code)
    console.log("on_submit.r",r)
  }

  useEffect(() => {
    return () => console.log("login.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">
        <div className="d-flex justify-content-center bd-highlight mt-2">
          <h1 className="">Access code</h1>
          <KbNumbers onsubmit={on_submit}/>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LoginInsert;
