import select from "helpers/query_select"
import {is_empty} from "helpers/functions"

const _query = {
  table: "app_product",
  alias: "t",
  
  fields:[
    "t.insert_date",
    "t.insert_user",
    "t.update_date",
    "t.update_user",
    "t.delete_date",
    "t.delete_user",
    "t.is_enabled",
    "t.i",

    "t.id",
    "t.code_erp",
    "t.description",
    "t.description_full",
    "t.slug",
    "t.units_min",
    "t.units_max",
    "t.price_gross",
    "t.price_sale",
    "t.price_sale1",
    "t.price_sale2",
    "t.display",
    "t.id_user",
    "t.url_image",
  ],

}

export const get_obj_entity = (objparam={filters:{}})=>{
  const objselect = select()
    .set_comment("product-entity")
    .set_table(_query.table, _query.alias)
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
