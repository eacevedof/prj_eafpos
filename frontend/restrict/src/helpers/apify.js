const Apify = {
  //https://github.com/eacevedof/prj_phpapify/tree/master/backend/src/Controllers/Apify
  select: {
    table: "",
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

    get_query(){
      const thisselect = Apify.select
      const oform = new FormData()

      //table
      oform.append("queryparts[table]",thisselect.table)

      if(thisselect.foundrows)
        oform.append("queryparts[foundrows]",thisselect.foundrows)

      if(thisselect.distinct)
        oform.append("queryparts[distinct]",thisselect.distinct)
      
      thisselect.fields.forEach((field,i) => {
        oform.append(`queryparts[fields][${i}]`,field)
      });

      thisselect.joins.forEach((join,i) => {
        oform.append(`queryparts[joins][${i}]`,join)
      });

      thisselect.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });

      thisselect.groupby.forEach((field,i) => {
        oform.append(`queryparts[groupby][${i}]`,field)
      });

      thisselect.having.forEach((metric,i) => {
        oform.append(`queryparts[having][${i}]`,metric)
      });

      thisselect.orderby.forEach((field,i) => {
        oform.append(`queryparts[orderby][${i}]`,field)
      });      

      if(thisselect.limit.perpage){
        if(thisselect.limit.perpage!==null)
          oform.append(`queryparts[limit][perpage]`,thisselect.limit.perpage)
        oform.append(`queryparts[limit][regfrom]`,thisselect.limit.regfrom)
      }
      
      return oform
    },

    reset(){
      const thisselect = Apify.select
      thisselect.table = ""
      thisselect.foundrows =0
      thisselect.distinct = 0
      thisselect.fields = []
      thisselect.joins = []
      thisselect.where = []
      thisselect.groupby = []
      thisselect.having = []
      thisselect.orderby = []
      thisselect.limit = {perpage:null, regfrom:0}
    },
  }, //select
  
  insert:{
    table: "",
    fields: [],
    extra: {},

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
    
    reset(){
      const thisinsert = Apify.insert
      thisinsert.table = ""
      thisinsert.fields = []
      thisinsert.extra = {}
    },    
  },//insert

  update:{
    table: "",
    fields: [],
    where: [],
    extra: {},

    get_query(){
      const thisupdate = Apify.update
      const oform = new FormData()
      oform.append("action","update")

      //table
      oform.append("queryparts[table]",thisupdate.table)

      
      thisupdate.fields.forEach( field => {
        oform.append(`queryparts[fields][${field.k}]`,field.v)
      });

      thisupdate.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });      

      const extrakeys = Object.keys(thisupdate.extra)
      extrakeys.forEach(key => {
        const v = thisupdate.extra[key]
        oform.append(`queryparts[${key}]`,v)
      })       

      return oform
    },
    
    reset(){
      const thisupdate = Apify.update
      thisupdate.table = ""
      thisupdate.fields = []
      thisupdate.where = []
      thisupdate.extra = {}
    },    
  },//update

  delete:{
    table: "",
    where: [],
    extra: {},

    get_query(){
      const thisdelete = Apify.delete
      const oform = new FormData()
      oform.append("action","delete")

      //table
      oform.append("queryparts[table]",thisdelete.table)
      
      //where
      thisdelete.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });      

      const extrakeys = Object.keys(thisdelete.extra)
      extrakeys.forEach(key => {
        const v = thisdelete.extra[key]
        oform.append(`queryparts[${key}]`,v)
      }) 

      return oform
    },
    
    reset(){
      const thisdelete = Apify.delete
      thisdelete.table = ""
      thisdelete.where = []
      thisdelete.extra = {}
    },    
  },//delete  

  deletelogic:{
    table: "",
    where: [],
    extra: {},
    delete_platform: "",

    get_query(){
      const thisdeletelogic = Apify.deletelogic
      const oform = new FormData()
      oform.append("action","deletelogic")

      //table
      oform.append("queryparts[table]",thisdeletelogic.table)

      if(thisdeletelogic.delete_platform !== "")
      oform.append(`queryparts[fields][delete_platform]`,thisdeletelogic.delete_platform)

      thisdeletelogic.where.forEach((strcond,i) => {
        oform.append(`queryparts[where][${i}]`,strcond)
      });      

      const extrakeys = Object.keys(thisdeletelogic.extra)
      extrakeys.forEach(key => {
        const v = thisdeletelogic.extra[key]
        oform.append(`queryparts[${key}]`,v)
      })       

      return oform
    },
    
    reset(){
      const thisdeletelogic = Apify.deletelogic
      thisdeletelogic.table = ""
      thisdeletelogic.where = []
      thisdeletelogic.extra = {}
    },    
  },//deletelogic
}
  
  export default Apify