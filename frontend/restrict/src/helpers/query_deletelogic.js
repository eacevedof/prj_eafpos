import {add} from "helpers/functions"

export default () => {
  const q = {
    init(){
      this.comment = ""
      this.table =  ""
      this.platform = ""
      this.where = []
      this.extras = []
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

    set_platform(platform) {
      this.platform = platform ?? ""
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
      oform.append("action","deletelogic")
      oform.append("queryparts[table]", this.table)
      if(this.comment)
        oform.append("queryparts[comment]", this.comment)

      if(this.platform)
        oform.append(`queryparts[fields][delete_platform]`,this.platform)

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
