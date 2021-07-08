const get_pair = alphabet => char => steps => {
  if(!alphabet.includes(char)) return char;
  const ilen = alphabet.length;
  const ipos = alphabet.map((ch, i) => (ch === char) ? i : null).filter(i => i !== null)[0]
  const total = ipos + steps
  if (total < ilen) {
    return alphabet[total]
  }
  const mod = total % ilen
  return alphabet[mod]
}

const get_encrypted = alphabet => steps => string => {
  //debugger
  if(string==="") return string
  const chars = string.split("")
  const result = chars.map(ch => get_pair(alphabet)(ch)(steps))
  return result.join("")
}

export default get_encrypted

export const get_select_form = (query, fnencrypt) => {
  let key = ""
  let value = ""

  const form = new FormData()

  key = fnencrypt("cache_time")
  value = fnencrypt(query["cache_time"].toString())

  form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(query["table"])
  form.append(`queryparts[${key}]`, value)

  key = fnencrypt("foundrows")
  value = fnencrypt(query["foundrows"].toString())
  form.append(`queryparts[${key}]`, value)

  key = fnencrypt("distinct")
  value = fnencrypt(query["distinct"].toString())
  form.append(`queryparts[${key}]`, value)

  key = fnencrypt("fields")
  query.fields.forEach((field,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))

  key = fnencrypt("joins")
  query.joins.forEach((join,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(join)))

  key = fnencrypt("where")
  query.where.forEach((strcond,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(strcond)))

  key = fnencrypt("groupby")
  query.groupby.forEach((field,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))

  key = fnencrypt("having")
  query.having.forEach((metric,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(metric)))

  key = fnencrypt("orderby")
  query.orderby.forEach((field,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(field)))

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
  value = fnencrypt(this.comment.toString())
  if(this.comment) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("table")
  value = fnencrypt(this.table.toString())
  if(this.table) form.append(`queryparts[${key}]`, value)

  key = fnencrypt("where")
  query.where.forEach((strcond,i) => form.append(`queryparts[${key}][${i}]`, fnencrypt(strcond)))

  this.extras.forEach( prop => form.append(`queryparts[${fnencrypt(prop.p)}]`, fnencrypt(prop.v)))

  return form
}