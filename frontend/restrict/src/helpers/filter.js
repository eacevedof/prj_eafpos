import {pr, get_urlvalue, is_empty} from "helpers/functions"

const get_fields = arconfs => arconfs.
                              filter(objconf => !is_empty(objconf.table) ).
                              map(objconf => objconf.table.fields.map(objf => ({name:`${objconf.table.alias}.${objf.name}`,labels:objf.labels}))).
                              reduce((arac, arcurr) => [...arac, ...arcurr])
                                    
const get_value = arlabels => arlabels.map(strlabel => get_urlvalue(strlabel)).filter(strval => strval!=="")[0] || ""

const get_fields_vals = arfields => {
  const arvalues = arfields.map(objfield => ({name:objfield.name, value:get_value(objfield.labels) }))
  return arvalues
}

//filtro por url GET
const get_filterand = arfilterconf => {

  const arfields = get_fields(arfilterconf)
  const arvalues = get_fields_vals(arfields)

  const objfilter = {
    op: "AND",
    fields: arvalues.filter(obj => obj.value !== "").map(obj => ({field:obj.name, value:obj.value})),
  } 

  return objfilter
}

//filtro caja de texto
export const get_filteror = (arfilterconf, search) =>{
  if(!search) return {}
  const arfields = get_fields(arfilterconf)

  const objfilter = {
    op: "OR",
    fields: arfields.map(obj => ({field:obj.name, value:search})),
  }   
  return objfilter
}

export default get_filterand