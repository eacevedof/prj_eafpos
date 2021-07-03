import {add} from "helpers/functions"

export default () =>{
  const q = {
    init(){
      this.comment = ""
      this.table =  ""
      this.fields = []
      this.where = []
      this.extras = []
      return this
    },

    set_comment(comment) {
      this.table = comment ?? ""
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

    set_wheres(arwheres) {
      this.where = arwheres ?? []
      return this
    },

    add_where(where) {
      add(this.where, where)
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

    get_query(){
      const oform = new FormData()
      oform.append("action","update")
      if(this.comment) oform.append("queryparts[comment]", this.comment)
      oform.append("queryparts[table]",this.table)

      this.fields.forEach( field => {
        oform.append(`queryparts[fields][${field.f}]`,field.v)
      });

      this.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });

      this.extras.forEach( prop => {
        oform.append(`queryparts[${prop.p}]`,prop.v)
      })

      return oform
    },
  }//q

  return q.init()
}
