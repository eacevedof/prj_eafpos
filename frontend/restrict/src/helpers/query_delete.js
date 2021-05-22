import {add} from "helpers/functions"

export default () =>{
  const q = {
    init(){
      this.table =  ""
      this.where = []
      this.extras = []
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

    get_query(){
      const oform = new FormData()
      oform.append("action","delete")
      oform.append("queryparts[table]",this.table)
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

/*
*   delete:{
    table: "",
    where: [],
    extra: {},

    get_query(){
      const this = Apify.delete
      const oform = new FormData()
 
    },
    
    reset(){
      const this = Apify.delete
      this.table = ""
      this.where = []
      this.extra = {}
    },    
  },//delete  
* */