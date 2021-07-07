import {is_defined } from "helpers/functions"
import apify from "providers/apify"
import {get_user_by_tpvcode, get_is_ssesion, get_insert_uuid, get_session_id} from "./queries/query_tpvcode"
import db from "helpers/localdb"

export const async_get_user_by_tpvcode = async tpvcode => {
  const objquery = get_user_by_tpvcode(tpvcode)
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_in_session = async () => {
  const usersession = db.select("session_user")
  if(!usersession) return false

  const sessionid = db.select("session_id")
  if(!sessionid) return false

  const token = db.select("token_apify")

  const objquery = get_is_ssesion(token, sessionid, usersession)
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_insert_rnd = async (token, usermini) => {
  const objquery = get_insert_uuid(token, usermini)
  const r = await apify.async_insert(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_get_session_id = async (token, codecache) => {
  const objquery = get_session_id(token, codecache)
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r.result[0]["session_id"]
}
