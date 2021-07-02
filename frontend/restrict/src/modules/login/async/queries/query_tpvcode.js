import helpapify from "helpers/apify"
import insert from "helpers/query_insert"
import select from "helpers/query_select"
import {get_sanitized} from "helpers/functions"
import get_uuid from "helpers/random"

const _query = {
  table: "base_user",
  table_session: "app_user_sessions",
  alias: "t",

  fields:[
    "t.id",
    "t.fullname",
    "t.code_cache",
  ],

  where:[
    "t.delete_date IS NULL",
    "t.is_enabled=1",
  ],
}

export const get_user_by_tpvcode = tpvcode => {
  const code = get_sanitized(tpvcode)
  const objselect = select()
      .set_comment("get_user_by_tpvcode")
      .set_table(_query.table, _query.alias)
      .set_fields(_query.fields)
      .set_wheres(_query.where)
      .add_where(`t.tpv_code = '${code}'`)
  return objselect

}//get_one

export const get_id_by_usersession = usersession => {
  const objselect = select()
      .set_comment("get_id_by_usersession")
      .set_table(_query.table_session, _query.alias)
      .add_field("t.id")
      .add_where("user_session",usersession)
  return objselect
}//get_id_by_usersession

export const get_insert_uuid = (token, codecache) => {
  const objinsert = insert()
      .set_comment("get_insert_uuid")
      .set_table(_query.table_session)
      .add_field("update_platform","3")
      .add_field("apify_token", token)
      .add_field("code_cache", codecache)
      .add_field("user_session", get_uuid())
      .add_extra("autosysfields", 1)
  return objinsert
}


