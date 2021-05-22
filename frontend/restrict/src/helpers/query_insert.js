import {add} from "helpers/functions"

export default () =>{
  const q = {
    init: function (){
      this.table =  "";
      this.fields = [];
      this.extra = {};
      return this
    },

    set_table: function (table, alias="") {
      this.table = alias ? `${table} as \`${alias}\`` : table
      return this
    },

    set_fields: function (arfields) {
      this.fields = arfields ?? []
      return this
    },

    add_field: function (field, alias="") {
      const fullfield = alias ? `${field} as \`${alias}\`` : field
      add(this.fields, fullfield)
      return this
    },

    set_orderbys: function (arorderbys) {
      this.orderby = arorderbys ?? []
      return this
    },

    add_orderby: function (orderby) {
      add(this.orderby, orderby)
      return this
    },

    set_limit: function ({perpage=null, regfrom=0}) {
      this.limit = {perpage, regfrom}
      return this
    },

    set_perpage: function (perpage=null) {
      this.limit.perpage = perpage
      return this
    },

    set_regfrom: function (regfrom=0) {
      this.limit.regfrom = regfrom
      return this
    },

    get_query(){
      const thisinsert = Apify.insert
      const oform = new FormData()
      oform.append("action","insert")

      //table
      oform.append("queryparts[table]",thisinsert.table)

      thisinsert.fields.forEach( field => {
        oform.append(`queryparts[fields][${field.k}]`,field.v)
      });

      const extrakeys = Object.keys(thisinsert.extra)
      extrakeys.forEach(key => {
        const v = thisinsert.extra[key]
        oform.append(`queryparts[${key}]`,v)
      })

      return oform
    },
  }//q

  return q.init()
}

