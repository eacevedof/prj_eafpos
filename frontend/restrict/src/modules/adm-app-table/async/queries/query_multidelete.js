import qdelete from "helpers/query_delete";
import {is_empty} from "helpers/functions"

const _query = {
  table: "app_table",
  key1: "id",
}

export const get_obj_multidelete = (objparam={keys:[]}) =>{
  const querydelete = qdelete()
    .set_table(_query.table)
  
  if(is_empty(objparam.keys)) {
    querydelete.add_where(`1!=1`)
    return querydelete
  }

  const strkeys = objparam.keys.join(",")
  querydelete.add_where(`${_query.key1} IN (${strkeys})`)
  return querydelete
}