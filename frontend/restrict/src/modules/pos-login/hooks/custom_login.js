import {useEffect} from "react"
import {useHistory} from "react-router-dom"
import db from "helpers/localdb"
import {async_get_session_id, async_get_user_by_tpvcode, async_insert_rnd} from "modules/pos-login/async/async_repository"

function CustomLogin() {
  const history = useHistory()

  const on_submit = async tpvcode => {
    const pincode = tpvcode.toString()
    let r = await async_get_user_by_tpvcode(pincode)

    db.delete("session_user")
    db.delete("session_id")
    if(parseInt(r.foundrows)===1) {

      const token = db.select("apify-token")
      const usermini = r.result[0]
      await async_insert_rnd(token, usermini)
      r = await async_get_session_id(token, usermini?.code_cache)
      if(!r) return
      db.save("session_user", usermini)
      db.save("session_id", r)

      let url = db.select("last_location")
      db.delete("last_location")
      if (url && url!=="" && url!=="/") {
        return history.push(url)
      }
      history.push("/pos")
    }
  }

  useEffect(() => {
    db.delete("session_user")
    db.delete("session_id")
    return () => console.log("pos-login.insert.unmounting")
  },[])
  
  return {
    on_submit
  }
}

export default CustomLogin;
