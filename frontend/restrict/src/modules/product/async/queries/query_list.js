import helpapify from "helpers/apify"
import {is_empty, pr} from "helpers/functions"

export const VIEWCONFIG = {
 
  CACHE_KEY: "products.search",
  
  PERPAGE: 25,
  
  KEYFIELD: "id",
  
  URL_PAGINATION: "/admin/products/%page%",
  
  ACTIONS: {
    //hay que aplicar texto e iconos
    detail: {url:"/admin/product/%key%", icon:"fa fa-info-circle", text:"Detail"},
    update: {url:"/admin/product/update/%key%", icon:"fa fa-pencil", text:"Update"},
    delete: {url:"/admin/product/delete/%key%", icon:"fa fa-trash", text:"Delete"},
    deletelogic: {url:"/admin/product/delete-logic/%key%", icon:"fa fa-trash", text:"Delete L"},
    clone: {url:"/admin/product/clone/%key%", icon:"fa fa-files-o", text:"Clone"}, 
  },

  MULTIACTIONS: {
    delete: {icon:"fa fa-trash", text:"Delete"},
    deletelogic: {icon:"fa fa-trash", text:"Delete L"},
  }

}

//consulta
const query = {

  table: "app_product",
  alias: "t",

  fields:[
    "t.update_date",
    "t.delete_date",
    "t.is_enabled",
    "t.i",
    "t.id",
    "t.code_erp",
    "t.description",
    "t.description_full",
    "t.slug",
    "t.display",
    "t.units_min",
    "t.units_max",
    "t.price_gross",
    "t.price_sale",
    "t.price_sale1",
    "t.price_sale2",
  ],

  joins:[],

  where:[
    "t.delete_date IS NULL"
  ],
}

//configuración ui grid
export const grid = {
  headers:[
    {
      text: 'nº',
      align: 'start',
      sortable: true,
      value: 'id',
    },
    { text: 'Code', value: 'code_erp' },
    { text: 'Desc', value: 'description' },
    { text: 'Desc big', value: 'description_full' },
    { text: 'Slug', value: 'slug' },
    { text: 'Show', value: 'display' },
    { text: 'U. min', value: 'units_min' },
    { text: 'U. max', value: 'units_max' },
    { text: 'Price g.', value: 'price_gross' },
    { text: 'Price s.', value: 'price_sale' },
    { text: 'Price s1', value: 'price_sale1' },
    { text: 'Updated', value: 'update_date' },
    
  ]
}

//configuración filtros
export const filterconf = [
  {
    //tabla principal
    table:{
      name: query.table,
      alias: query.alias,

      fields:[
        {name: "id", labels:["n","n","id"]},
        {name: "code_erp", labels:["code"]},
        {name: "description", labels:["desc"]},
        {name: "description_full", labels:["descbig"]},
        {name: "display", labels:["show"]},
      ]
    }
  },
  {}
]

//fabfica de query
export const get_obj_list = (objparam={filters:{}, page:{}, orderby:{}})=>{

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
                    .map(filter => `${filter.field} LIKE '%${filter.value}%'`)
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

  objselect.limit.perpage = VIEWCONFIG.PERPAGE
  objselect.limit.regfrom = 0
  if(!is_empty(objparam.page)){
    //pr(objparam.page,"page")
    objselect.limit.perpage = objparam.page.ippage
    objselect.limit.regfrom = objparam.page.ifrom
  }

  objselect.orderby.push(`${query.alias}.id DESC`)
  //pr(objselect,"get_obj_list.objselect")
  return objselect

}//get_obj_list
