
import helpapify from "helpers/apify"
import {isset, is_empty, pr} from "helpers/functions"
import db from "helpers/localdb"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_multideletelogic = (objparam={key:"", keys:[]})=>{
  const objdellog = helpapify.deletelogic
  objdellog.reset()
  objdellog.delete_platform = "3"
  objdellog.table = query.table
  objdellog.extra = {autosysfields:1, useruuid: db.select("useruuid")}

  if(is_empty(objparam.key) || is_empty(objparam.keys) || objparam.key==="" || objparam.keys.length===0){
    objdellog.where.push(`1!=1`)
    return objdellog
  }
  //pr(objparam,"objparam in")
  const strkeys = objparam.keys.join(",")
  objdellog.where.push(`${objparam.key} IN (${strkeys})`)
  return objdellog
}
