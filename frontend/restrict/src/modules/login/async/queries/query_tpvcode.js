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
}

export const get_insert_uuid = (token, usermini) => {
  const objinsert = insert()
      .set_comment("get_insert_uuid")
      .set_table(_query.table_session)
      .add_field("update_platform","3")
      .add_field("token_apify", token)
      .add_field("id_user", usermini?.id)
      .add_field("user_codecache", usermini?.code_cache)
      .add_field("session_id", get_uuid())
      .add_extra("autosysfields", 1)
  return objinsert
}

export const get_is_ssesion = (token, sessionid, usersession) => {
  const sessid = get_sanitized(sessionid)
  const codtoken = get_sanitized(token)

  const objselect = select()
      .set_comment("get_is_ssesion")
      .set_table(_query.table_session, _query.alias)
      .add_field("t.session_id")
      .add_where(`t.token_apify = '${codtoken}'`)
      .add_where(`t.session_id = '${sessid}'`)
      .add_where(`t.user_codecache = '${usersession?.code_cache}'`)
  return objselect
}//get_is_ssesion

export const get_session_id = (token, codecache) => {
  const codtoken = get_sanitized(token)
  const codcache = get_sanitized(codecache)

  const objselect = select()
      .set_comment("get_session_id")
      .set_table(_query.table_session, _query.alias)
      .add_field("t.session_id")
      .add_where(`t.token_apify = '${codtoken}'`)
      .add_where(`t.user_codecache = '${codcache}'`)
      .add_orderby(`t.id DESC`)
      .set_perpage(1)

  return objselect
}//get_session_id
