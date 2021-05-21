import helpapify from "helpers/apify"
import {is_empty, pr} from "helpers/functions"

export const VIEWCONFIG = {
 
  CACHE_KEY: "tables.search",
  
  PERPAGE: 25,
  
  KEYFIELD: "id",
  
  URL_PAGINATION: "/admin/zzz-tpls/%page%",
  
  ACTIONS: {
    //hay que aplicar texto e iconos
    detail: {url:"/admin/zzz-tpl/%key%", icon:"fa fa-info-circle", text:"Detail"},
    update: {url:"/admin/zzz-tpl/update/%key%", icon:"fa fa-pencil", text:"Update"},
    delete: {url:"/admin/zzz-tpl/delete/%key%", icon:"fa fa-trash", text:"Delete"},
    deletelogic: {url:"/admin/zzz-tpl/delete-logic/%key%", icon:"fa fa-trash", text:"Delete L"},
    clone: {url:"/admin/zzz-tpl/clone/%key%", icon:"fa fa-files-o", text:"Clone"}, 
  },

  MULTIACTIONS: {
    delete: {icon:"fa fa-trash", text:"Delete"},
    deletelogic: {icon:"fa fa-trash", text:"Delete L"},
  }

}

//consulta
const query = {

  table: "zzz_tpl",
  alias: "t",

  fields:[
    "t.update_date",
    "t.delete_date",
    "t.is_enabled",
      
    "t.id",
    "t.code_erp",
    "t.description",
    "t.diner_names", //250
    "t.diner_num",
    "t.coord_x",
    "t.coord_y",
    "t.time_start",
    "t.id_user",
    "t.reserved",
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
      text: "nº",
      align: "start",
      sortable: true,
      value: "id",
    },

    { text: "Code", value: "code_erp" },
    { text: "Desc", value: "description" },
    { text: "Diner names", value: "diner_names" },
    { text: "Diners", value: "diner_num" },
    { text: "x", value: "coord_x" },
    { text: "y", value: "coord_y" },
    { text: "Time start", value: "time_start" },
    { text: "Reserved note.", value: "reserved" },
    { text: "Updated", value: "update_date" },
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
        {name: "diner_names", labels:["diner names"]},
        {name: "reserved", labels:["reserved note"]},
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
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field} LIKE "%${filter.value}%"`)
                    .join(` ${objparam.filters.op} `)

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
    objselect.limit.perpage = objparam.page.ippage
    objselect.limit.regfrom = objparam.page.ifrom
  }

  objselect.orderby.push(`${query.alias}.id DESC`)
  return objselect

}//get_obj_list
