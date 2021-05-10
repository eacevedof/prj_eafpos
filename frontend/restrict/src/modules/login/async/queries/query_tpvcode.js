import helpapify from "helpers/apify"
import {get_sanitized} from "helpers/functions"


/**
 * select id, fullname
from base_user
WHERE 1
AND delete_date is null
and is_enabled=1
 */

//consulta
const query = {

  table: "base_user",
  alias: "t",

  fields:[
    "t.id",
    "t.fullname",
    "t.code_cache"
  ],

  where:[
    "t.delete_date IS NULL",
    "t.is_enabled=1",
  ],
}

export const get_one = tpvcode => {

  const code = get_sanitized(tpvcode)
  const objselect = helpapify.select
  objselect.reset()
  
  objselect.table = `${query.table} ${query.alias}`  
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  query.where.forEach(cond => objselect.where.push(cond))
  objselect.where.push(`t.tpv_code = '${code}'`)
  return objselect

}//get_one

export const get_by_codecache = codecache => {

  const code = get_sanitized(codecache)
  const objselect = helpapify.select
  objselect.reset()
  
  objselect.table = `${query.table} ${query.alias}`  
  objselect.fields.push(`t.id`)
  objselect.where.push(`t.code_cache = '${code}'`)
  return objselect

}//get_by_codecache
