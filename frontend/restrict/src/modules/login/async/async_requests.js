import {is_defined } from "helpers/functions"
import apidb from "providers/apidb"
import {get_one, get_by_codecache} from "./queries/query_tpvcode"


export const async_get_one_by_tpvcode = async tpvcode => {
  const objquery = get_one(tpvcode)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_is_pinned = async codecache => {
  const objquery = get_by_codecache(codecache)
  const r = await apidb.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}
