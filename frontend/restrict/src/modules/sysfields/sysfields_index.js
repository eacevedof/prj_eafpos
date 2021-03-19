import helpapify from "helpers/apify"
import apidb from "providers/apidb"
import {is_defined, pr, is_undefined} from "helpers/functions"

const query = {
  table: "base_user",
  alias: "t",
  
  fields:[
    "t.nickname",
  ],
}

const get_objselect = userid =>{
  const objselect = helpapify.select
  objselect.reset()

  objselect.table = `${query.table} ${query.alias}`
  objselect.foundrows = 1 //que devuelva el total de filas
    
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf)) 
  objselect.where.push(`t.id = '${userid}'`)

  return objselect
}

const async_get_useralias = async userid => {
  //pr(userid)
  if(!userid || isNaN(userid) || is_undefined(userid)) return ""

  const query = get_objselect(userid)
  const r = await apidb.async_get_list(query)
  //pr(r)
  if(is_defined(r.error)) return r.error

  if(is_defined(r.result)) return r.result[0].nickname

}

export default async_get_useralias