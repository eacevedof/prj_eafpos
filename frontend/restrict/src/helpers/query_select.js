const add = function (obj, toadd) {
  if(!Array.isArray(obj)) return
  if(!toadd) return

  if (Array.isArray(toadd)) {
    toadd.forEach(item => obj.push(item))
  }
  else {
    obj.push(toadd)
  }

}

const select = function (){
  const q = {
    init: function (){
      this.table= ""
      this.foundrows = 0
      this.distinct = 0
      this.fields = []
      this.joins = []
      this.where = []
      this.groupby =[]
      this.having = []
      this.orderby = []
      this.limit = {perpage:null, regfrom:0}
      return this
    },

    set_table: function (table, alias="") {
      this.table = alias ? `${table} as \`${alias}\`` : table
      return this
    },

    is_foundrows: function (i) {
      this.foundrows = i ? 1 : 0
      return this
    },

    is_distinct: function (i) {
      this.distinct = i ? 1 : 0
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

    set_joins: function (arjoins) {
      this.joins = arjoins ?? []
      return this
    },

    add_join: function (join) {
      add(this.joins, join)
      return this
    },

    set_wheres: function (arwheres) {
      this.where = arwheres ?? []
      return this
    },

    add_where: function (where) {
      add(this.where, where)
      return this
    },

    set_groupbys: function (argroupbys) {
      this.groupby = argroupbys ?? []
      return this
    },

    add_groupby: function (groupby) {
      add(this.groupby, groupby)
      return this
    },

    set_havings: function (arhavings) {
      this.having = arhavings ?? []
      return this
    },

    add_having: function (having) {
      add(this.having, having)
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
      const oform = new FormData()

      //table
      oform.append("queryparts[table]",this.table)

      if(this.foundrows)
        oform.append("queryparts[foundrows]",this.foundrows)

      if(this.distinct)
        oform.append("queryparts[distinct]",this.distinct)

      this.fields.forEach((field,i) => {
        oform.append(`queryparts[fields][${i}]`,field)
      });

      this.joins.forEach((join,i) => {
        oform.append(`queryparts[joins][${i}]`,join)
      });

      this.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });

      this.groupby.forEach((field,i) => {
        oform.append(`queryparts[groupby][${i}]`,field)
      });

      this.having.forEach((metric,i) => {
        oform.append(`queryparts[having][${i}]`,metric)
      });

      this.orderby.forEach((field,i) => {
        oform.append(`queryparts[orderby][${i}]`,field)
      });

      if(this.limit.perpage){
        if(this.limit.perpage!==null)
          oform.append(`queryparts[limit][perpage]`,this.limit.perpage)
        oform.append(`queryparts[limit][regfrom]`,this.limit.regfrom)
      }

      return oform
    },    
  }//q
  return q.init()
}

export default select

const insert = function (){}

const update = function (){}

const delet = function (){}

const delete_logic = function (){}