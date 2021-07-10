const qinsert = () =>{
  const q = {
    reset(){
      this.comment = ""
      this.table =  ""
      this.fields = []
      this.extras = []
    },

    init(){
      this.reset()
      return this
    },

    set_comment(comment) {
      this.comment = comment ?? ""
      return this
    },

    set_table(table) {
      this.table = table ?? ""
      return this
    },

    set_fields(arfields) {
      this.fields = arfields ?? []
      return this
    },

    add_field(field, value) {
      this.fields.push({f:field, v:value})
      return this
    },

    set_extras(extra) {
      this.extras = extra ?? []
      return this
    },

    add_extra(prop, value) {
      this.extras.push({p:prop, v:value})
      return this
    },

    get_form(){
      const oform = new FormData()
      oform.append("action","insert")
      if(this.comment) oform.append("queryparts[comment]", this.comment)
      oform.append("queryparts[table]", this.table)

      this.fields.forEach( field => {
        oform.append(`queryparts[fields][${field.f}]`,field.v)
      });

      this.extras.forEach( prop => {
        oform.append(`queryparts[${prop.p}]`,prop.v)
      })

      return oform
    },

    get_self(){
      return this
    }
  }//q

  return q.init()
}

export default qinsert