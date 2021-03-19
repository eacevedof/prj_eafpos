
import helpapify from "helpers/apify"
import {pr, is_empty} from "helpers/functions"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_multidelete = (objparam={keys:[]}) =>{
  const field = "id"
  const objdelete = helpapify.delete
  objdelete.reset()
  objdelete.table = query.table
  
  if(is_empty(objparam.keys)) {
    objdelete.where.push(`1!=1`)
    return objdelete
  }

  const strkeys = objparam.keys.join(",")
  objdelete.where.push(`${field} IN (${strkeys})`)
  return objdelete
}