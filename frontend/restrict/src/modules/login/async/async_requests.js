import {is_defined } from "helpers/functions"
import apidb from "providers/apidb"
import {get_one, get_by_codecache} from "./queries/query_tpvcode"
import apiup from "../../../providers/apiupload";
import {get_obj_update} from "../../product/async/queries/query_update";

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

export const async_update_rnd = async (formdata) => {


  const objquery = get_obj_update(objparam, dbfields)
  //console.log("objparam",objquery)
  r = await apidb.async_update(objquery)

  if(is_defined(r.error)) throw r.error

  return r
}