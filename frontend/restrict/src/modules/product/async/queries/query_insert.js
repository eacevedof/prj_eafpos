import insert from "helpers/query_insert"
import {get_keys, is_empty} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_insert = (objparam={fields:{}})=>{
  const objinsert = insert()
    .set_table(query.table)
    .add_extra("autosysfields", 1)
    .add_extra("useruuid", db.select("useruuid"))

  if(!is_empty(objparam.fields)){
    objinsert.add_field("insert_platform", "3")
    const fields = get_keys(objparam.fields)
    fields.forEach( field => {
      objinsert.add_field(field, objparam.fields[field])
    })
  }
  return objinsert
}
