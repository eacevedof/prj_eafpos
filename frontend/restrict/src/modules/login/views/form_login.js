import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_one_by_tpvcode, async_update_rnd} from "modules/login/async/async_repository"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KeyboardSecret from "components/bootstrap/app/keyboards/keyboard_secret"

function FormLogin() {
  const history = useHistory()

  const on_submit = async tpvcode => {
    const pincode = tpvcode.toString()
    let r = await async_get_one_by_tpvcode(pincode)
    console.log("result r tpv", r)
    db.delete("user_session")
    if(parseInt(r.foundrows)===1) {
      console.log("async_get_one_by_tpvcode",r)
      const usercode = r.result[0]["code_cache"]
      r = await async_update_rnd(usercode)
      r = await async_get_one_by_tpvcode(pincode)

      db.save("useruuid",usercode)
      db.save("user_session",r.result[0])
      r = db.select("last_location")
      console.log("r",r)
      db.delete("last_location")
      if (r && r!=="" && r!=="/") {
        return history.push(r)
      }
      history.push("/pos")
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
        <div className="d-flex flex-column">
          <h1 className="align-self-md-center">Access code</h1>
          <div className="align-self-md-center">
            <KeyboardSecret onaccept={on_submit}/>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default FormLogin;
