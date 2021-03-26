
import helpapify from "helpers/apify"
import {get_keys, is_empty} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_insert = (objparam={fields:{}})=>{
  const objinsert = helpapify.insert
  objinsert.reset()
  objinsert.table = query.table
  objinsert.extra = {autosysfields:1, useruuid: db.select("useruuid")}

  if(!is_empty(objparam.fields)){
    const fields = get_keys(objparam.fields)
    fields.forEach( field => {
      objinsert.fields.push({k:field,v:objparam.fields[field]})
    })
    objinsert.fields.push({k:"insert_platform",v:"3"})
  }
  //pr(objinsert)
  return objinsert
}
