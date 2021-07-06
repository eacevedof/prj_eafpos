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


const get_encrypted = alphabet => string => steps => {
  if(string==="") return string
  const chars = string.split("")
  const result = chars.map(ch => get_pair(alphabet)(ch)(steps))
  return result.join("")
}

export default get_encrypted