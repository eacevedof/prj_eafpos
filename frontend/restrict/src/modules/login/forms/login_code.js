import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_one_by_tpvcode} from "modules/login/async/async_requests"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KbNumbers from "components/bootstrap/app/kb-numbers/kb_numbers"

function LoginCode() {
  const history = useHistory()

  const on_submit = async code => {
    const r = await async_get_one_by_tpvcode(code)
    db.delete("user_session")
    if(parseInt(r.foundrows)===1) {
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
          <KbNumbers onsubmit={on_submit}/>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LoginCode;
