import select from "helpers/query/query_select"
import {is_empty} from "helpers/functions"

const _query = {
  table: "zzz_tpl",
  alias: "t",
  
  fields:[
    //%FIELDS_QUERY_ENTITY%
  ],

}

export const get_obj_entity = (objparam={filters:{}})=>{
  const objselect = select()
    .set_table(_query.table, _query.alias)
    .is_foundrows(1)
    .is_distinct(1)
    .set_joins(_query.joins)
    .set_wheres(_query.where)
    .set_fields(_query.fields)

  if(!is_empty(objparam.filters.fields)){
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field}='${filter.value}'`)
                    .join(` ${objparam.filters.op} `)
    objselect.add_where(`(${strcond})`)
  }

  return objselect
}
