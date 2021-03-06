import qdelete from "helpers/query/query_delete"
import {isset, is_empty} from "helpers/functions"

const _TABLE = "app_product"

export const get_obj_delete = (objparam={fields:{},keys:[]})=>{
  const querydelete = qdelete()
    .set_comment("product-delete")
    .set_table(_TABLE)

  if(isset(objparam.fields) && isset(objparam.keys)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      querydelete.add_where(`${field}='${objparam.fields[field]}'`)
    })
  }

  if(is_empty(objparam.keys)) querydelete.add_where(`1!=1`)

  return querydelete
}