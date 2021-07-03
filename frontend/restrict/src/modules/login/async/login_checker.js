import apiauth from "providers/apiauth"
import db from "helpers/localdb"
import {is_defined} from "helpers/functions"
import {async_is_pinned} from "modules/login/async/async_repository"

const USER = "fulanito"
const PASSWORD = "MaFaLDa1234"

export const async_gettoken = async () => {
  const objuser = {username: USER, password: PASSWORD}
  console.log("login.index.objuser",objuser)
  const apifytoken = await apiauth.async_get_apifytoken(objuser)
  if(is_defined(apifytoken.error))
    return ""

  return apifytoken
}// async_gettoken

export const async_islogged = async () => {
  const apifytoken = db.select("token_apify")
  if(!apifytoken) return false

  const response = await apiauth.async_is_validtoken()
  console.log("modules.login.async_islogged.async_is_validtoken.response",response)

  if(is_defined(response.error)){
    return false
  }  

  return true
}// async_islogged

export const async_ispinned = async () => {
  const usersession = db.select("user_session")
  if(!usersession) return false

  const response = await async_is_pinned(usersession.tpv_uuid)
  if(is_defined(response.error)){
    return false
  }  
  return true
}// async_ispinned
