import {is_defined } from "helpers/functions"
import apidb from "providers/apidb"
import {get_one_by_tpvcode, get_id_by_tpvuuid, get_one_by_tpvuuid, get_update_uuid} from "./queries/query_tpvcode"

export const async_get_one_by_tpvcode = async tpvcode => {
  const objquery = get_one_by_tpvcode(tpvcode)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_is_pinned = async tpvuuid => {
  const objquery = get_id_by_tpvuuid(tpvuuid)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_update_rnd = async usercode => {
  const objquery = get_update_uuid(usercode)
  const r = await apidb.async_update(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_get_one_by_tpvuuid = async tpvuuid => {
  const objquery = get_one_by_tpvuuid(tpvuuid)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}