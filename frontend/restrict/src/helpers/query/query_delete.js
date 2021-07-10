import {add} from "helpers/functions"

const qdelete = () =>{
  const q = {

    reset(){
      this.comment = ""
      this.table =  ""
      this.where = []
      this.extras = []
    },

    init(){
      this.reset()
      return this
    },

    set_comment(comment){
      this.comment = comment
      return this
    },

    set_table(table) {
      this.table = table ?? ""
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

    get_form(){
      const oform = new FormData()
      oform.append("action","delete")
      if(this.comment) oform.append("queryparts[comment]", this.comment)
      oform.append("queryparts[table]",this.table)
      this.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
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

export default qdelete