import insert from "helpers/query_insert"
import {get_keys, is_empty} from "helpers/functions"
import db from "helpers/localdb"

const _TABLE = "app_product"

export const get_obj_insert = (objparam={fields:{}})=>{
  const queryinsert = insert()
    .set_comment("product-insert")
    .set_table(_TABLE)
    .add_extra("autosysfields", 1)
    .add_extra("codecache", db.select("codecache"))
    .add_field("insert_platform", "3")

  if(!is_empty(objparam.fields)){
    get_keys(objparam.fields)
      .forEach( field => queryinsert.add_field(field, objparam.fields[field]))
  }
  return queryinsert
}
