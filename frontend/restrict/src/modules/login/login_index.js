import apiauth from 'providers/apiauth'
import db from "helpers/localdb"
import {is_undefined, is_defined, pr} from "helpers/functions"

const USER = "fulanito"
const PASSWORD = "menganito"

export const async_gettoken = async () => {
  const objuser = {username: USER, password: PASSWORD}
  console.log("login.index.objuser",objuser)
  const apifytoken = await apiauth.async_get_apifytoken(objuser)
  //pr(apifytoken,"apifytoken")
  if(is_defined(apifytoken.error))
    return ""

  return apifytoken
}// async_gettoken

export const async_islogged = async () => {

  const apifytoken = db.select("token_dbsapify")
  if(!apifytoken) return false

  //true | obj.error
  const response = await apiauth.async_is_validtoken()
  //pr(response,"isvalidtoken")
  console.log("modules.login.async_islogged.async_is_validtoken.response",response)

  if(is_defined(response.error)){
    return false
  }  

  return true

} // async_islogged
