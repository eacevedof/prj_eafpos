import delet from "helpers/query_delete"
import {isset, is_empty} from "helpers/functions"

const query = {
  table: "app_product",
}

export const get_obj_delete = (objparam={fields:{},keys:[]})=>{
  const objdelete = delet()
    .set_table(query.table)

  if(isset(objparam.fields) && isset(objparam.keys)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      objdelete.add_where(`${field}='${objparam.fields[field]}'`)
    })
  }

  if(is_empty(objparam.keys)) objdelete.add_where(`1!=1`)

  return objdelete
}