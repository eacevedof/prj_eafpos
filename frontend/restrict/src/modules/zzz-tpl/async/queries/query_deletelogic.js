import helpapify from "helpers/apify"
import {isset} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "zzz_tpl",
  alias: "t",
}

export const get_obj_deletelogic = (objparam={fields:{},keys:[]})=>{
  const objdellog = helpapify.deletelogic
  objdellog.reset()
  objdellog.delete_platform = "3"
  objdellog.table = query.table
  objdellog.extra = {autosysfields:1, useruuid: db.select("useruuid")}

  if(isset(objparam.fields) && isset(objparam.fields)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      objdellog.where.push(`${field}='${objparam.fields[field]}'`)
    })
    
  }

  return objdellog
}
