import deletelogic from "helpers/query_deletelogic"
import {isset} from "helpers/functions"
import db from "helpers/localdb"

const _TABLE = "app_product"

export const get_obj_deletelogic = (objparam={fields:{},keys:[]})=>{
  const querydeletel = deletelogic()
    .set_table(_TABLE)
    .add_extra("autosysfields", "1")
    .add_extra("useruuid", db.select("useruuid"))
    .set_platform("3")

  if(isset(objparam.fields) && isset(objparam.fields)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      querydeletel.add_where(`${field}='${objparam.fields[field]}'`)
    })
  }

  return querydeletel
}
