import {add} from "helpers/functions"

export default () =>{
  const q = {
    init(){
      this.comment = ""
      this.cache_time = 0
      this.table = ""
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

    set_comment(comment){
      this.comment = comment
      return this
    },

    set_cache_time(fsecs) {
      this.cache_time = fsecs
      return this
    },

    set_table(table, alias="") {
      this.table = alias ? `${table} as \`${alias}\`` : table
      return this
    },

    is_foundrows(i) {
      this.foundrows = i ? 1 : 0
      return this
    },

    is_distinct(i) {
      this.distinct = i ? 1 : 0
      return this
    },

    set_fields(arfields) {
      this.fields = arfields ?? []
      return this
    },

    add_field(field, alias="") {
      const fullfield = alias ? `${field} as \`${alias}\`` : field
      add(this.fields, fullfield)
      return this
    },

    set_joins(arjoins) {
      this.joins = arjoins ?? []
      return this
    },

    add_join(join) {
      add(this.joins, join)
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

    set_groupbys(argroupbys) {
      this.groupby = argroupbys ?? []
      return this
    },

    add_groupby(groupby) {
      add(this.groupby, groupby)
      return this
    },

    set_havings(arhavings) {
      this.having = arhavings ?? []
      return this
    },

    add_having(having) {
      add(this.having, having)
      return this
    },

    set_orderbys(arorderbys) {
      this.orderby = arorderbys ?? []
      return this
    },

    add_orderby(orderby) {
      add(this.orderby, orderby)
      return this
    },

    set_limit({perpage=null, regfrom=0}) {
      this.limit = {perpage, regfrom}
      return this
    },

    set_perpage(perpage=null) {
      this.limit.perpage = perpage
      return this
    },

    set_regfrom(regfrom=0) {
      this.limit.regfrom = regfrom
      return this
    },

    get_query(){

      const objdata = {}
      if(this.comment) objdata["queryparts[comment]"] = this.comment
      objdata["queryparts[cache_time]"] = this.cache_time
      objdata["queryparts[table]"] = this.table
      if(this.foundrows) objdata["queryparts[foundrows]"] = this.foundrows
      if(this.distinct) objdata["queryparts[distinct]"] = this.distinct

      this.fields.forEach((field,i) => objdata[`queryparts[fields][${i}]`] = field)
      this.joins.forEach((join,i) => objdata[`queryparts[joins][${i}]`] = join)
      this.where.forEach((strcond,i) => objdata[`queryparts[where][${i}]`] = strcond)
      this.groupby.forEach((field,i) => objdata[`queryparts[groupby][${i}]`] = field)
      this.having.forEach((metric,i) => objdata[`queryparts[having][${i}]`] = metric)
      this.orderby.forEach((field,i) => objdata[`queryparts[orderby][${i}]`] = field)

      if(this.limit.perpage){
        if(this.limit.perpage!==null)
          objdata[`queryparts[limit][perpage]`] = this.limit.perpage
        objdata[`queryparts[limit][regfrom]`] = this.limit.regfrom
      }

      return oform
    },    
  }//q

  return q.init()
}

