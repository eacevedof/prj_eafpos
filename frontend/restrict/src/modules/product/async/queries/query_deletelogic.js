import deletelogic from "helpers/query_deletelogic"
import {isset} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
}

export const get_obj_deletelogic = (objparam={fields:{},keys:[]})=>{
  const objdellog = deletelogic()
    .set_table(query.table)
    .add_extra("autosysfields", "1")
    .add_extra("useruuid", db.select("useruuid"))
    .set_platform("3")

  if(isset(objparam.fields) && isset(objparam.fields)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      objdellog.add_where(`${field}='${objparam.fields[field]}'`)
    })
  }

  return objdellog
}
