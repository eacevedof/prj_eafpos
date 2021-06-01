import {get_sanitized} from "helpers/functions"
import select from "helpers/query_select";

const _query = {
  table: "app_table",
  alias: "t",

  fields:[
    "t.insert_date",
    "t.update_date",
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
    "t.reserved",
    "t.is_printed",
    `
    CASE  
      WHEN TRIM(COALESCE(t.diner_names,''))='' THEN
        'btn-free'
      ELSE
        CASE t.is_printed
          WHEN 0 THEN
            CASE TRIM(COALESCE(t.reserved,''))
              WHEN '' THEN
                'btn-occupied'
              ELSE
                'btn-reserved'
            END
          ELSE
            'btn-printed'
        END
    END AS btn_state 
    `,
    `
    CASE  
      WHEN t.time_start IS NOT NULL THEN
        ROUND((UNIX_TIMESTAMP() - UNIX_TIMESTAMP(t.time_start)) / 60)
      ELSE
        ''
    END AS time_passed 
    `,
    "u.description as user",
  ],

  joins: [
    "LEFT JOIN base_user u ON t.id_user = u.id"
  ],

  where:[
    "t.delete_date IS NULL",
    "t.is_enabled=1",
  ],
}

export const get_one_by_uuid = uuid => {
  const code = get_sanitized(uuid)
  const objselect = select()
      .set_table(_query.table, _query.alias)
      .set_fields(_query.fields)
      .set_joins(_query.joins)
      .add_where(_query.where)
      .add_orderby(`${_query.alias}.id DESC`)
      .add_where(`t.code_cache = '${code}'`)
  return objselect

}//get_one_by_uuid

export const get_obj_list = ()=>{
  const objselect = select()
    .set_table(_query.table, _query.alias)
    .is_foundrows(1)
    .set_fields(_query.fields)
    .set_joins(_query.joins)
    .add_where(_query.where)
    .set_limit(50, 0)
    .add_orderby(`${_query.alias}.coord_x ASC`)
    .add_orderby(`${_query.alias}.coord_y ASC`)
  return objselect

}//get_obj_list




