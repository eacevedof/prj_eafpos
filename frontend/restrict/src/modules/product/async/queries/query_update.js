import update from "helpers/query_update"
import {get_keys,is_defined} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
}

export const get_obj_update = (objparam={fields:{},keys:[]},dbfields=[])=>{
  const objupdate = update()
    .set_table(query.table)
    .add_extra("autosysfields", 1)
    .add_extra("useruuid", db.select("useruuid"))

  if(!is_defined(objparam.keys)) return null
  //evita que se actualicen todos los registros que no son una entidad
  if(objparam.keys.length === 0) return null

  if(is_defined(objparam.fields)){
    objupdate.add_field("update_platform", "3")
    const onlyfields = dbfields.map(dbfield => dbfield.field_name)
    const fields = get_keys(objparam.fields)
    fields.forEach( field => {
      if(!onlyfields.includes(field))
        return
  
      //si el campo es clave
      if(objparam.keys.includes(field)){
        objupdate.add_where(`${field}='${objparam.fields[field]}'`)
      }
      else
        objupdate.add_field(field, objparam.fields[field])
    })
  }

  return objupdate
}
