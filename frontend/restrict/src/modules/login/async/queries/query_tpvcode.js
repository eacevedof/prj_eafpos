import helpapify from "helpers/apify"
import {get_sanitized} from "helpers/functions"
import get_uuid from "helpers/random"

const query = {
  table: "base_user",
  alias: "t",

  fields:[
    "t.id",
    "t.fullname",
    "t.code_cache",
    "t.tpv_uuid"
  ],

  where:[
    "t.delete_date IS NULL",
    "t.is_enabled=1",
  ],
}

export const get_one_by_tpvcode = tpvcode => {

  const code = get_sanitized(tpvcode)
  const objselect = helpapify.select
  objselect.reset()
  
  objselect.table = `${query.table} ${query.alias}`  
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  query.where.forEach(cond => objselect.where.push(cond))
  objselect.where.push(`t.tpv_code = '${code}'`)
  return objselect

}//get_one

export const get_one_by_tpvuuid = tpvuuid => {
  const objselect = helpapify.select
  objselect.reset()
  
  objselect.table = `${query.table} ${query.alias}`  
  objselect.fields.push(`t.id`)
  const uuid = get_sanitized(tpvuuid)
  objselect.where.push(`t.tpv_uuid = '${uuid}'`)
  return objselect

}//get_by_codecache

export const get_update_uuid = codecache => {
  const objupdate = helpapify.update
  objupdate.reset()
  objupdate.table = query.table
  objupdate.extra = {autosysfields:1 }
  objupdate.fields.push({k:"update_platform",v:"3"})
  objupdate.fields.push({k:"tpv_uuid",v:get_uuid()})
  objupdate.where.push(`code_cache='${codecache}'`)
  return objupdate
}


