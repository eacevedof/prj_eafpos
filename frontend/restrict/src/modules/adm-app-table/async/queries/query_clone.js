import insert from "helpers/query/query_insert"

const _TABLE = "app_table"

export const get_obj_clone = (objparam={fields:{}},dbfields=[])=>{
  const queryinsert = insert()
    .set_table(_TABLE)

  if(!is_empty(objparam.fields)){
    
    const onlyfields = dbfields.map(dbfield => dbfield.field_name)
    const pks = dbfields.filter(dbfield => dbfield.is_pk == "1").map(dbfield => dbfield.field_name)

    get_keys(objparam.fields)
      .forEach( field => {
        if(!is_empty(onlyfields)){
          if(!onlyfields.includes(field) || pks.includes(field))
            return
        }
        queryinsert.add_field(field, objparam.fields[field])
      })  
  }
  return queryinsert
}
