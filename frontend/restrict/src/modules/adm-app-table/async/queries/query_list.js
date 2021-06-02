import select from "helpers/query_select"
import {is_empty} from "helpers/functions"

export const VIEWCONFIG = {
 
  CACHE_KEY: "app_tables.search",
  
  PERPAGE: 25,
  
  KEYFIELD: "id",
  
  URL_PAGINATION: "/admin/app-tables/%page%",
  
  ACTIONS: {
    detail: {url:"/admin/app-table/%key%", icon:"fa fa-info-circle", text:"Detail"},
    update: {url:"/admin/app-table/update/%key%", icon:"fa fa-pencil", text:"Update"},
    delete: {url:"/admin/app-table/delete/%key%", icon:"fa fa-trash", text:"Delete"},
    deletelogic: {url:"/admin/app-table/delete-logic/%key%", icon:"fa fa-trash", text:"Delete L"},
    clone: {url:"/admin/app-table/clone/%key%", icon:"fa fa-files-o", text:"Clone"}, 
  },

  MULTIACTIONS: {
    delete: {icon:"fa fa-trash", text:"Delete"},
    deletelogic: {icon:"fa fa-trash", text:"Delete L"},
  }

}

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
    "t.code_cache",
    "t.reserved"
  ],

  joins:[],

  where:[
    "t.delete_date IS NULL"
  ],
}

export const grid = {
  headers:[
    {
      text: 'nº',
      align: 'start',
      sortable: true,
      value: 'id',
    },

    {text: "label-code_erp", value: "code_erp"},
{text: "label-description", value: "description"},
{text: "label-diner_names", value: "diner_names"},
{text: "label-diner_num", value: "diner_num"},
{text: "label-coord_x", value: "coord_x"},
{text: "label-coord_y", value: "coord_y"},
{text: "label-time_start", value: "time_start"},
{text: "label-id_user", value: "id_user"},
{text: "label-order_by", value: "order_by"},
{text: "label-reserved", value: "reserved"}
  ]
}

export const filterconf = [
  {
    table:{
      name: _query.table,
      alias: _query.alias,

      fields:[
        {name: "code_erp", labels: ["label-code_erp"]},
{name: "description", labels: ["label-description"]},
{name: "diner_names", labels: ["label-diner_names"]},
{name: "diner_num", labels: ["label-diner_num"]},
{name: "coord_x", labels: ["label-coord_x"]},
{name: "coord_y", labels: ["label-coord_y"]},
{name: "time_start", labels: ["label-time_start"]},
{name: "id_user", labels: ["label-id_user"]},
{name: "order_by", labels: ["label-order_by"]},
{name: "reserved", labels: ["label-reserved"]}
      ]
    }
  },
  {}
]

export const get_obj_list = (objparam={filters:{}, page:{}, orderby:{}})=>{
  const objselect = select()
    .set_table(_query.table, _query.alias)
    .is_foundrows(1)
    .set_fields(_query.fields)
    .set_joins(_query.joins)
    .add_where(_query.where)
    .set_limit(VIEWCONFIG.PERPAGE, 0)
    .add_orderby(`${_query.alias}.id DESC`)

  if(!is_empty(objparam.filters.fields)){
    const strcond = objparam.filters
      .fields
      .map(filter => `${filter.field} LIKE '%${filter.value}%'`)
      .join(` ${objparam.filters.op} `)

    objselect.add_where(`(${strcond})`)
  }

  if(!is_empty(objparam.page)){
    objselect
      .set_regfrom(objparam.page.ifrom)
      .set_perpage(objparam.page.ippage)
  }

  return objselect

}//get_obj_list
