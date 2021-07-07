import select from "helpers/query/query_select"
import {is_empty} from "helpers/functions"

const _query = {
  table: "app_table",
  alias: "t",
  
  fields:[
    "t.insert_date",
"t.update_date",
"t.delete_date",
"t.is_enabled",
"t.id",
"t.code_erp",
"t.description",
"t.diner_names",
"t.diner_num",
"t.coord_x",
"t.coord_y",
"t.time_start",
"t.id_user",
"t.order_by",
"t.reserved"
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
