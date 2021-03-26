
import {is_empty} from "helpers/functions"
import helpapify from "helpers/apify"

const query = {
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
  const objselect = helpapify.select
  objselect.reset()

  objselect.table = `${query.table} ${query.alias}`
  objselect.foundrows = 1 //que devuelva el total de filas
  objselect.distinct = 1  //que aplique distinct
    
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
    
  if(!is_empty(objparam.filters.fields)){
    //pr(objparam.filters,"objparam.filter")
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field}='${filter.value}'`)
                    .join(` ${objparam.filters.op} `)
    //pr(strcond,"strcond")
    objselect.where.push(`(${strcond})`)
  }
  
  if(!is_empty(query.joins)){
    query.joins.forEach(join => objselect.joins.push(join))
  }

  if(!is_empty(query.where)){
    query.where.forEach(cond => objselect.where.push(cond))
  } 
    
  return objselect
}
