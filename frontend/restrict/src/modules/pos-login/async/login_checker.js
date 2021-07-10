import apiauth from "helpers/providers/apifyauth"
import db from "helpers/localdb"
import {is_defined} from "helpers/functions"
import {async_in_session} from "modules/pos-login/async/async_repository"

const USER = "fulanito"
const PASSWORD = "MaFaLDa1234"

export const async_gettoken = async () => {
  const objuser = {username: USER, password: PASSWORD}
  console.log("pos-login.index.objuser",objuser)
  const apifytoken = await apiauth.async_get_apifytoken(objuser)
  if(is_defined(apifytoken.error))
    return ""

  return apifytoken
}// async_gettoken

export const async_is_tokenized = async () => {
  const apifytoken = db.select("apify-token")
  if(!apifytoken) return false

  const response = await apiauth.async_is_validtoken()
  console.log("modules.pos-login.async_is_tokenized.async_is_validtoken.response",response)

  if(is_defined(response.error)){
    return false
  }  

  return true
}// async_is_tokenized

export const async_is_pinned = async () => {
  const response = await async_in_session()
  if(!response) return false
  
  if(is_defined(response.error)){
    return false
  }  
  return true
}// async_is_pinned
