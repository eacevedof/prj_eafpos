import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_one_by_tpvcode, async_update_rnd} from "modules/login/async/async_requests"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KeyboardSecret from "components/bootstrap/app/keyboards/keyboard_secret"

function FormLogin() {
  const history = useHistory()

  const on_submit = async tpvcode => {
    let r = await async_get_one_by_tpvcode(tpvcode)
    console.log("result r tpv", r)
    db.delete("user_session")
    if(parseInt(r.foundrows)===1) {
      console.log("async_get_one_by_tpvcode",r)
      const usercode = r.result[0]["code_cache"]
      r = await async_update_rnd(usercode)
      r = await async_get_one_by_tpvcode(tpvcode)
      db.save("user_session",r.result[0])
      history.push("admin")
    }
  }

  useEffect(() => {
    db.delete("user_session")
    return () => console.log("login.insert.unmounting")
  },[])
  
  return (
    <>
      <Navbar />
      <main className="container">
        <div className="d-flex justify-content-center bd-highlight mt-2">
          <h1>Access code</h1>
          <KeyboardSecret onsubmit={on_submit}/>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default FormLogin;
