import {is_defined } from "helpers/functions"
import apidb from "providers/apidb"
import {get_user_by_tpvcode, get_id_by_usersession, get_insert_uuid} from "./queries/query_tpvcode"

export const async_get_user_by_tpvcode = async tpvcode => {
  const objquery = get_user_by_tpvcode(tpvcode)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_is_pinned = async usersession => {
  const objquery = get_id_by_usersession(usersession)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_insert_rnd = async (token, codecache) => {
  const objquery = get_insert_uuid(codecache)
  const r = await apidb.async_insert(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}
