const Localdb = {

  is_string(v){
    return typeof v === "string"
  },

  to_string(obj){
    return JSON.stringify(obj)
  },

  select(k){
    const v = localStorage.getItem(k)
    if(this.is_json(v))
      return JSON.parse(v)
    
    return v
  },

  save(k,v){
    let val = v
    if(!this.is_string(val))
      val = this.to_string(val)

    localStorage.setItem(k,val)
    const test = this.select(k);
    console.log("after save:",test)
  },

  delete(k){
    localStorage.removeItem(k)
  },

  dropdb(){
    localStorage.clear()
  },

  is_json(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}  

}

export default Localdb;