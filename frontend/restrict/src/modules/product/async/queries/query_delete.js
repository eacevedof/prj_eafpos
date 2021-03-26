
import helpapify from "helpers/apify"
import {isset, pr, is_empty} from "helpers/functions"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_delete = (objparam={fields:{},keys:[]})=>{
  const objdelete = helpapify.delete
  objdelete.reset()
  objdelete.table = query.table
  
  if(isset(objparam.fields) && isset(objparam.keys)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      objdelete.where.push(`${field}='${objparam.fields[field]}'`)
    })  
  }

  if(is_empty(objparam.keys)) objdelete.where.push(`1!=1`)

  //pr(objdelete,"objdelete")
  return objdelete
}