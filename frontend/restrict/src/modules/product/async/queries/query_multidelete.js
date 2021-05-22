import qdelete from "helpers/query_delete";
import {is_empty} from "helpers/functions"

const query = {
  table: "app_product",
  key1: "id",
}

export const get_obj_multidelete = (objparam={keys:[]}) =>{
  const querydelete = qdelete()
    .set_table(query.table)
  
  if(is_empty(objparam.keys)) {
    querydelete.add_where(`1!=1`)
    return querydelete
  }

  const strkeys = objparam.keys.join(",")
  querydelete.add_where(`${query.key1} IN (${strkeys})`)
  return querydelete
}