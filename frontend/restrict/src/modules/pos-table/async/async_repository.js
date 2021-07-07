import {is_defined } from "helpers/functions"
import apify from "providers/apify"
import {get_obj_list, get_one_by_uuid} from "./queries/query_table"

export const async_get_onbe_by_uuid = async uuid => {
  const objquery = get_one_by_uuid(uuid)
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_get_all_enabled_not_deleted = async () => {
  const objquery = get_obj_list()
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}
