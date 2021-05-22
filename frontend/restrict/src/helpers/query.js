/*
*     table: "",
    foundrows:0,
    distinct: 0,
    fields: [],
    joins: [],
    where: [],
    groupby:[],
    having:[],
    orderby:[],
    //limit:{regfrom:0,perpage:300,},
    limit:{perpage:null, regfrom:0},
* */

const select = function (){
  const q = {
    init: function (){
      this.table= ""
      this.foundrows =0
      this.distinct = 0
      this.fields = []
      this.joins = []
      this.where = []
      this.groupby=[]
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
    },

    set_fields: function (arfields) {
      this.fields = arfields ?? []
      return this
    },

    add_field: function (field, alias="") {
      const fullfield = alias ? `${field} as \`${alias}\`` : field
      this.fields = this.fields ? this.fields.concat([fullfield]): [fullfield]
      return this
    },

    set_joins: function (arjoins) {
      this.joins = arjoins ?? []
      return this
    },

    add_join: function (join) {
      this.joins.push(join)
      return this
    },

    set_wheres: function (arwheres) {
      this.where = arwheres ?? []
      return this
    },

    add_where: function (where) {
      this.where.push(where)
      return this
    },

  }//q

  q.init()
  return q
}

const insert = function (){}

const update = function (){}

const delet = function (){}

const delete_logic = function (){}