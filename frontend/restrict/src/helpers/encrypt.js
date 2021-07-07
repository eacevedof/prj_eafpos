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
  if(string==="") return string
  const chars = string.split("")
  const result = chars.map(ch => get_pair(alphabet)(ch)(steps))
  return result.join("")
}

const get_form_select = (query, fnencrypt) => {

}

export default get_encrypted