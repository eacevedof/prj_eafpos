import { pr, is_empty } from "helpers/functions"


const CMD_TAG=">"
const CMD_SEPARATOR = ";"
const KEYVAL_SEPARATOR = ":"

const get_fields = arconfs => arconfs.
                                filter(objconf => !is_empty(objconf.table) ).
                                map(objconf => objconf.table.fields.map(objf => ({name:`${objconf.table.alias}.${objf.name}`,labels:objf.labels}))).
                                reduce((arac, arcurr) => [...arac, ...arcurr])

const get_cmdkeyval = strkey => strkey.split(CMD_SEPARATOR).
                                  map(strkv => strkv.trim()).
                                  map(strkv => strkv.split(KEYVAL_SEPARATOR)).
                                  filter(ar => ar.length===2).
                                  map(ar => ({label:ar[0].trim().toLowerCase(),value:ar[1].trim()}))

//obtiene las etiquetas del cmd
const get_labels = arlblval => arlblval.map(arlblval => arlblval.label)
const get_name_by_label = (arfieldlabels, label) => arfieldlabels.filter(objflbls => objflbls.labels.includes(label)).map(objflbls => objflbls.name)

const get_fields_by_labels = (arfieldlabels, arlabels) => arlabels.map(label => get_name_by_label(arfieldlabels, label))

const get_value_by_labels = (arlblval, arlabels) => arlblval.filter(obj => arlabels.includes(obj.label)).map(obj => obj.value)[0] || ""


export const is_command = search => {
  if(!search) return false;
  if(!(typeof search === 'string' || search instanceof String)) return false;
  const str = search.trim()
  if(!str) return false;
  return (str.charAt(0)===CMD_TAG && str.includes(KEYVAL_SEPARATOR) && str.length>4)
}

//>code:28;desc:yuca
export const get_filtercmd = (arfilterconf, search) => {
  if(!search) return {}
  const cmd =  search.replace(CMD_TAG,"").trim()

  const arfieldlabels = get_fields(arfilterconf)
  //pr(arfieldlabels,"arfieldlabels"); return {}
    
  const arlblval = get_cmdkeyval(cmd)
  //pr(arlblval,"arlblval"); return {}
  const labels = get_labels(arlblval)
  //pr(labels,"labels"); return {}
  const arfields = get_fields_by_labels(arfieldlabels,labels).map(ar => ar[0])
  //pr(arfields,"arfields"); return {}

  const arvalues = arfieldlabels.filter(obj => arfields.includes(obj.name)).map( obj => ({name:obj.name, value: get_value_by_labels(arlblval, obj.labels)}))

  const objfilter = {
    op: "AND",
    fields: arvalues.filter(obj => obj.value !== "").map(obj => ({field:obj.name, value:obj.value})),
  }   
  return objfilter
}