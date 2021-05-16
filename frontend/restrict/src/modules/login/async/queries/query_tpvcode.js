import helpapify from "helpers/apify"
import {get_keys, get_sanitized, is_defined} from "helpers/functions"
import {get_rnd} from "helpers/random"
import apiup from "../../../../providers/apiupload";
import {get_obj_update} from "../../../product/async/queries/query_update";
import apidb from "../../../../providers/apidb";
import db from "../../../../helpers/localdb";

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

export const save_uuid = userid => {
  const objupdate = helpapify.update
  objupdate.reset()
  objupdate.table = query.table
  objupdate.extra = {autosysfields:1 }
  objupdate.fields.push({k:"update_platform",v:"3"})
  objupdate.fields.push({k:"tpv_uuid",v:get_uuid(10)})
  objupdate.where.push(`id='${userid}'`)
  return objupdate
}


