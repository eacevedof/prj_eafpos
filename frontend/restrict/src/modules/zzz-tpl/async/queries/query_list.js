import select from "helpers/query_select"
import {is_empty} from "helpers/functions"

export const VIEWCONFIG = {
 
  CACHE_KEY: "zzz_tpls.search",
  
  PERPAGE: 25,
  
  KEYFIELD: "id",
  
  URL_PAGINATION: "/admin/zzz-tpls/%page%",
  
  ACTIONS: {
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

const _query = {

  table: "zzz_tpl",
  alias: "t",

  fields:[
    "%__FIELDS__%",
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

export const filterconf = [
  {
    table:{
      name: _query.table,
      alias: _query.alias,

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
