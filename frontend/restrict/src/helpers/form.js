const get_field = elem => {
  const idpref = elem.id || ""
  const parts = idpref.split("-")
  if(parts.length>1) return parts[1]
  return idpref
}

export default get_field