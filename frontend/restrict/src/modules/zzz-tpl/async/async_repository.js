import { is_defined, get_pagefrom } from "helpers/functions"

import apify from "helpers/providers/apify"
import apiup from "helpers/providers/apiupload"

import {get_filteror} from "helpers/filter"
import {get_filtercmd, is_command} from "helpers/filtercmd"

import {get_obj_list, filterconf, VIEWCONFIG} from "./queries/query_list"
import {get_obj_entity} from "./queries/query_entity"
import {get_obj_insert} from "./queries/query_insert"
import {get_obj_update} from "./queries/query_update"
import {get_obj_delete} from "./queries/query_delete"
import {get_obj_multidelete} from "./queries/query_multidelete"
import {get_obj_deletelogic} from "./queries/query_deletelogic"
import {get_obj_multideletelogic} from "./queries/query_multideletelogic"


export const async_get_list = async (page, search="") => {
  const ippage = VIEWCONFIG.PERPAGE
  const ifrom = get_pagefrom(page, ippage)
  let objfilter = get_filteror(filterconf, search)
  if (is_command(search))
    objfilter = get_filtercmd(filterconf, search)

  const objparam = {page:{ippage,ifrom},filters:objfilter}
  const objquery = get_obj_list(objparam)
  const r = await apify.async_get_list(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_get_by_id = async (id) => {
  if(!id) return []
  const objparam = {filters:{fields:[{field:"id",value:id}]}}
  const query = get_obj_entity(objparam)
  const r = await apify.async_get_list(query)
  
  if(is_defined(r.error)) throw r.error
  
  if(is_defined(r.result.length))
    return r.result[0]
  return r
}

export const async_insert = async (formdata) => {

  const objparam = {fields:{...formdata}}
  const objquery = get_obj_insert(objparam)

  const r = await apify.async_insert(objquery)
  if(is_defined(r.error)) throw r.error

  return r
}

export const async_update = async formdata => {
  const keys = ["id"]
  const temp = {...formdata}
  const fieldsdel = ["delete_date","insert_date","update_date","i"]
  fieldsdel.forEach(field =>{
    delete temp[field] 
  })
  
  const dbfields = Object.keys(temp).map(field_name => ({field_name}))
  const objparam = {fields:temp, keys}
  const objquery = get_obj_update(objparam, dbfields)
  const r = await apify.async_update(objquery)
  
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_delete = async (formdata)=>{
  const keys = ["id"]
  const objparam = {fields:{...formdata}, keys}
  const objquery = get_obj_delete(objparam)
  const r = await apify.async_delete(objquery)
  if(is_defined(r.error)) throw r.error
  return r
}

export const async_clone = async (formdata)=>{
  const temp = {...formdata}
  const fieldsdel = ["i", "id"]
  fieldsdel.forEach(field => {
    delete temp[field] 
  })

  temp.description = "(clone of ".concat(formdata.id).concat(") - ").concat(temp.description)
  
  const objparam = {fields:temp}
  const objquery = get_obj_insert(objparam)
  const r = await apify.async_insert(objquery)

  if(is_defined(r.error)) throw r.error

  return r
}

export const async_deletelogic = async (formdata)=>{
  const keys = ["id"]

  const objdellog = {
    id: formdata.id,
  }
  
  const dbfields = [{field_name:"id"}]
  const objparam = {fields:objdellog, keys}
  const objquery = get_obj_deletelogic(objparam, dbfields)
  const r = await apify.async_update(objquery)
  
  if(is_defined(r.error)) throw r.error
  
  return r
}

export const async_get_maxuploadsize = async () => {
  const r = await apiup.async_get_maxsize()
  return r
}

export const async_multidelete = async arkeys => {
  const objparam = {key:"id", keys:arkeys}
  const objquery = get_obj_multidelete(objparam)
  const r = await apify.async_delete(objquery)

  if(is_defined(r.error)) throw r.error

  return r
}

export const async_multideletelogic = async arkeys => {
  const objparam = {key:"id", keys:arkeys}
  const objquery = get_obj_multideletelogic(objparam)
  const r = await apify.async_update(objquery)

  if(is_defined(r.error)) throw r.error

  return r
}