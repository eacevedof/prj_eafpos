import {add} from "helpers/functions"

export default () =>{
  const q = {
    init(){
      this.table =  ""
      this.fields = []
      this.extras = []
      return this
    },

    set_table(table, alias="") {
      this.table = alias ? `${table} as \`${alias}\`` : table
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

    get_query(){
      const oform = new FormData()
      oform.append("action","insert")
      oform.append("queryparts[table]", this.table)

      this.fields.forEach( field => {
        oform.append(`queryparts[fields][${field.f}]`,field.v)
      });

      this.extras.forEach( prop => {
        oform.append(`queryparts[${prop.p}]`,prop.v)
      })

      return oform
    },
  }//q

  return q.init()
}

