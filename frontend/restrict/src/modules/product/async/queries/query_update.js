
import helpapify from "helpers/apify"
import {get_keys,is_defined} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_update = (objparam={fields:{},keys:[]},dbfields=[])=>{
  const objupdate = helpapify.update
  objupdate.reset()
  objupdate.table = query.table
  objupdate.extra = {autosysfields:1, useruuid: db.select("useruuid")}

  if(!is_defined(objparam.keys)) return null
  //evita que se actualicen todos los registros que no son una entidad
  if(objparam.keys.length === 0) return null

  if(is_defined(objparam.fields)){
    const onlyfields = dbfields.map(dbfield => dbfield.field_name)
    const fields = get_keys(objparam.fields)

    fields.forEach( field => {
      if(!onlyfields.includes(field))
        return
  
      //si el campo es clave
      if(objparam.keys.includes(field)){
        objupdate.where.push(`${field}='${objparam.fields[field]}'`)
      }
      else
        objupdate.fields.push({k:field,v:objparam.fields[field]})
    })

    objupdate.fields.push({k:"update_platform",v:"3"})
  }

  return objupdate
}
