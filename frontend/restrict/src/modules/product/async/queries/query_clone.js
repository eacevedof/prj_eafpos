
import helpapify from "helpers/apify"

const query = {
  table: "app_product",
  alias: "t",
}

export const get_obj_clone = (objparam={fields:{}},dbfields=[])=>{
  const objinsert = helpapify.insert
  objinsert.reset()
  objinsert.table = query.table

  if(!is_empty(objparam.fields)){
    
    const onlyfields = dbfields.map(dbfield => dbfield.field_name)
    const pks = dbfields.filter(dbfield => dbfield.is_pk == "1").map(dbfield => dbfield.field_name)
    //pr(onlyfields,"onlyfields")
    const fields = get_keys(objparam.fields)
    
    fields.forEach( field => {
      if(!is_empty(onlyfields)){
        //si no es campo de la tabla o está y es pk
        if(!onlyfields.includes(field) || pks.includes(field))
          return
      }

      objinsert.fields.push({k:field, v:objparam.fields[field]})
    })  
  }
  //pr(objinsert)
  return objinsert
}
