import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_one_by_tpvcode, async_update_rnd} from "modules/login/async/async_repository"
import Navbar from "components/common/navbar"
import Footer from "components/common/footer"
import KeyboardSecret from "components/bootstrap/app/keyboards/keyboard_secret"
import CustomLogin from "modules/login/hooks/custom_login";

function FormLogin() {

  const {on_submit} = CustomLogin()

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
