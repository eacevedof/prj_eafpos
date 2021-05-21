import helpapify from "helpers/apify"
import { is_empty } from "helpers/functions"

const queryselect = helpapify.select

export const table = "zzz_tpl"

export const grid = {
  headers:[
    {
      text: 'nº',
      align: 'start',
      sortable: true,
      value: 'id',
    },
    { text: 'Action', value: 'colbuttons' },
    { text: 'Rem. IP', value: 'remote_ip' },
    { text: 'Country', value: 'country' },
    { text: 'Whois', value: 'whois' },
    { text: 'Domain', value: 'domain' },
    { text: 'R. URI', value: 'request_uri' },
    { text: 'GET', value: 'hasget' },
    { text: 'POST', value: 'haspost' },
    { text: 'In BL', value: 'inbl' },
    { text: 'Day', value: 'insert_date' },
  ]
}

export const config = [
  {
    table:{
      name: "app_ip_request",
      alias: "r",
      fields:[
        {name: "id", label:"Nº"},
        {name: "remote_ip", label:"Rem. IP"},
        {name: "insert_date", label:"Date"},
        {name: "domain", label:"Domain"},
        {name: "request_uri", label:"R. URI"},
        {name: "`get`", label:"GET"},
        {name: "post", label:"POST"},
      ]
    }
  },
  {
    table:{
      name: "app_ip_blacklist",
      alias: "bl",
      fields:[
        {name: "insert_date", label:"Date", alias:"bl_date"},
        {name: "reason", label:"Reason"},
      ]
    }
  },  
  {
    table:{
      name: "app_ip",
      alias: "i",
      fields:[
        {name: "country", label:"Country"},
        {name: "whois", label:"Whois"},
      ]
    }
  },  
]

const query = {
  fields:[
    "r.id",
    "r.remote_ip",
    "i.country",
    "i.whois",
    "r.domain",
    "r.request_uri",
    "r.`get`",
    "CASE WHEN r.`get`!='' THEN 'GET' ELSE '' END hasget",
    "r.post",
    "CASE WHEN r.`post`!='' THEN 'POST' ELSE '' END haspost",      
    "r.insert_date",
    "bl.insert_date bl_date",
    "bl.reason",
    "CASE WHEN bl.id IS NULL THEN '' ELSE 'INBL' END inbl",
  ],

  joins:[
    "LEFT JOIN app_ip_blacklist bl ON r.remote_ip = bl.remote_ip",
    "LEFT JOIN app_ip i ON r.remote_ip = i.remote_ip",
  ],

  where:[
    "i.whois NOT LIKE '%google%'",
    "i.whois NOT LIKE '%msn%'",
    "i.whois NOT LIKE '%sitelock.com%'"
  ],
}

export const get_obj_list = (objparam={filters:{}, page:{}, orderby:{}})=>{
  queryselect.reset()
  queryselect.table = `${table} r`
  queryselect.foundrows = 1 //que devuelva el total de filas
  queryselect.distinct = 1  //que aplique distinct
  
  query.fields.forEach(fieldconf => queryselect.fields.push(fieldconf))
  
  if(!is_empty(objparam.filters.fields)){
    //pr(objparam.filters,"objparam.filter")
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field} LIKE '%${filter.value}%'`)
                    .join(` ${objparam.filters.op} `)

    //pr(strcond,"strcond")
    queryselect.where.push(`(${strcond})`)
  }

  if(!is_empty(query.joins)){
    query.joins.forEach(join => queryselect.joins.push(join))
  }

  if(!is_empty(query.where)){
    query.where.forEach(cond => queryselect.where.push(cond))
  } 

  queryselect.limit.perpage = 1000
  queryselect.limit.regfrom = 0
  if(!is_empty(objparam.page)){
    //pr(objparam.page,"page")
    queryselect.limit.perpage = objparam.page.ippage
    queryselect.limit.regfrom = objparam.page.ifrom
  }

  queryselect.orderby.push("r.id DESC")
  //pr(queryselect,"get_obj_list.queryselect")
  return queryselect
}//get_list
