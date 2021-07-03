import {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_user_by_tpvcode, async_insert_rnd} from "modules/login/async/async_repository"

function CustomLogin() {
  const history = useHistory()

  const on_submit = async tpvcode => {
    const pincode = tpvcode.toString()
    let r = await async_get_user_by_tpvcode(pincode)
    console.log("result r tpv", r)
    db.delete("user_session")
    if(parseInt(r.foundrows)===1) {
      console.log("async_get_user_by_tpvcode",r)
      const token = db.select("token_apify")
      const usermini = r.result[0]
      await async_insert_rnd(token, usermini)
      db.save("user_session", usermini.code_cache)

      let url = db.select("last_location")
      db.delete("last_location")
      if (url && url!=="" && url!=="/") {
        return history.push(url)
      }
      history.push("/pos")
    }
  }

  useEffect(() => {
    db.delete("user_session")
    return () => console.log("login.insert.unmounting")
  },[])
  
  return {
    on_submit
  }
}

export default CustomLogin;
