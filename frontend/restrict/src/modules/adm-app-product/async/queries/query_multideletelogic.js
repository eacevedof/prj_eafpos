import deletelogic from "helpers/query/query_deletelogic"
import {is_empty} from "helpers/functions"
import db from "helpers/localdb"

const _TABLE = "app_product"

export const get_obj_multideletelogic = (objparam={key:"", keys:[]})=>{
  const querydeletel = deletelogic()
    .set_comment("product-multideletelogic")
    .set_table(_TABLE)
    .add_extra("autosysfields", "1")
    .set_platform("3")

  if(is_empty(objparam.key) || is_empty(objparam.keys) || objparam.key==="" || objparam.keys.length===0){
    querydeletel.add_where(`1!=1`)
    return querydeletel
  }

  const strkeys = objparam.keys.join(",")
  querydeletel.add_where(`${objparam.key} IN (${strkeys})`)
  return querydeletel
}
