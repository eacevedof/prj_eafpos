import select from "helpers/query_select"
import apidb from "providers/apidb"
import {is_defined, is_undefined} from "helpers/functions"

const _query = {
  table: "base_user",
  alias: "t",
  
  fields:[
    "t.nickname",
  ],
}

const get_objselect = userid =>{
  const objselect = select()
      .set_comment("sysfields")
      .set_cache_time(3600)
      .set_table(_query.table, _query.alias)
      .set_fields(_query.fields)
      .is_foundrows(1)
      .add_where(`t.id = '${userid}'`)
  return objselect
}

const async_get_useralias = async userid => {
  if(!userid || isNaN(userid) || is_undefined(userid)) return ""

  const query = get_objselect(userid)
  const r = await apidb.async_get_list(query)
  if(is_defined(r.error)) return r.error
  if(is_defined(r.result)) return r.result[0]["nickname"]

}

export default async_get_useralias