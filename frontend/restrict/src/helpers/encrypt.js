const get_pair = alphabet => steps => char => {
  const ipos = alphabet.indexOf(char)
  if(ipos === -1) return char
  const ilen = alphabet.length;
  const total = ipos + steps
  if (total < ilen) {
    return alphabet[total]
  }
  const mod = total % ilen
  return alphabet[mod]
}

const get_encrypted = alphabet => steps => string => {
  //debugger
  if(string===null || string==="undefined" || string==="") return ""
  const fnmemo = get_pair(alphabet)(steps)
  const result = string.split("").map(ch => fnmemo(ch))
  return result.join("")
}

export default get_encrypted

export const get_select_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  if (query.cache_time) {
    key = fnencrypt("cache_time")
    value = fnencrypt(query["cache_time"].toString())
    form.append(`queryparts[${key}]`, value)
  }

  key = fnencrypt("table")
  value = fnencrypt(query["table"])
  form.append(`queryparts[${key}]`, value)

  if (query.foundrows) {
    key = fnencrypt("foundrows")
    value = fnencrypt(query["foundrows"].toString())
    form.append(`queryparts[${key}]`, value)
  }

  if (query.distinct) {
    key = fnencrypt("distinct")
    value = fnencrypt(query["distinct"].toString())
    form.append(`queryparts[${key}]`, value)
  }

  key = fnencrypt("fields")
  query.fields.forEach((field, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))

  if (query.joins) {
    key = fnencrypt("joins")
    query.joins.forEach((join, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(join)))
  }

  key = fnencrypt("where")
  query.where.forEach((strcond, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(strcond)))

  if (query.groupby) {
    key = fnencrypt("groupby")
    query.groupby.forEach((field, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))
  }

  if (query.having) {
    key = fnencrypt("having")
    query.having.forEach((metric, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(metric)))
  }

  if(query.orderby) {
    key = fnencrypt("orderby")
    query.orderby.forEach((field, i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))
  }

  if(query.limit.perpage) {
    key = fnencrypt("limit")
    let key2 = fnencrypt("perpage")
    if(query.limit.perpage !== null) {
      form.append(`queryparts[${key}][${key2}]`, fnencrypt(query.limit.perpage.toString()))
    }
    key2 = fnencrypt("regfrom")
    form.append(`queryparts[${key}][${key2}]`, fnencrypt(query.limit.regfrom.toString()))
  }

  return form
}

export const get_delete_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  key = fnencrypt("cache_time")
  value = fnencrypt(query["cache_time"].toString())

  form.append("action","delete")
  form.append(`queryparts[${key}]`, value)

  key = fnencrypt("comment")
  value = fnencrypt(query.comment.toString())
  if(query.comment) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(query.table.toString())
  if(query.table) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("where")
  query.where.forEach((strcond,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(strcond)))

  query.extras.forEach( prop => form.append(`queryparts[${fnencrypt(prop.p)}]`, fnencrypt(prop.v.toString())))

  return form
}

export const get_deletelogic_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  form.append("action","deletelogic")

  key = fnencrypt("comment")
  value = fnencrypt(query.comment.toString())
  if(query.comment) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(query.table.toString())
  if(query.table) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("delete_platform")
  value = fnencrypt(query.platform.toString())
  if(query.platform)
    form.append(`queryparts[${fnencrypt("fields")}][${key}]`, value)

  key = fnencrypt("where")
  query.where.forEach((strcond,i) => form.append(`queryparts[${key}][${i}]`,fnencrypt(strcond)))

  query.extras.forEach( prop => form.append(`queryparts[${fnencrypt(prop.p)}]`, fnencrypt(prop.v.toString())))
  return form
}


export const get_insert_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  form.append("action","insert")

  key = fnencrypt("comment")
  value = fnencrypt(query.comment.toString())
  if(query.comment) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(query.table.toString())
  if(query.table) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("fields")
  query.fields.forEach( field => form.append(`queryparts[${key}][${fnencrypt(field.f)}]`, field.v ? fnencrypt(field.v.toString()) : "" ))

  query.extras.forEach( prop => form.append(`queryparts[${fnencrypt(prop.p)}]`, prop.v ? fnencrypt(prop.v.toString()) : "" ))
  return form

}

export const get_update_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  form.append("action","update")

  key = fnencrypt("comment")
  value = fnencrypt(query.comment.toString())
  if(query.comment) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(query.table.toString())
  if(query.table) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("fields")
  query.fields.forEach( field => form.append(`queryparts[${key}][${fnencrypt(field.f)}]`, field.v ? fnencrypt(field.v.toString()) : "" ))

  key = fnencrypt("where")
  query.where.forEach((strcond,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(strcond)))

  query.extras.forEach( prop => form.append(`queryparts[${fnencrypt(prop.p)}]`, prop.v ? fnencrypt(prop.v.toString()) : "" ))

  return form
}