import React from "react"
import {Redirect} from "react-router-dom"

import ZzzTplProvider from "modules/zzz-tpl/table_context"

import ZzzTplIndex from "modules/zzz-tpl/views/index"
import ZzzTplInsert from "modules/zzz-tpl/views/form_insert"
import ZzzTplClone from "modules/zzz-tpl/views/form_clone"
import ZzzTplUpdate from "modules/zzz-tpl/views/form_update"
import ZzzTplDetail from "modules/zzz-tpl/views/form_detail"
import ZzzTplDelete from "modules/zzz-tpl/views/form_delete"
import ZzzTplDeleteLogic from "modules/zzz-tpl/views/form_deletelogic"

export const routes = [
  {
    path:"/admin/zzz-tpl/insert",
    component: (<ZzzTplInsert />)
  },
  {
    path:"/admin/zzz-tpl/:id",
    component: (<ZzzTplDetail />)
  },
  {
    path:"/admin/zzz-tpl/update/:id",
    component: (<ZzzTplUpdate />)
  }, 
  {
    path:"/admin/zzz-tpl/delete/:id",
    component: (<ZzzTplDelete />)
  },     
  {
    path:"/admin/zzz-tpl/delete-logic/:id",
    component: (<ZzzTplDeleteLogic />)
  },  
  {
    path:"/admin/zzz-tpl/clone/:id",
    component: (<ZzzTplClone />)
  },  
  {
    path:"/admin/zzz-tpls/:page(\\d+)",
    component: (<ZzzTplProvider><ZzzTplIndex/></ZzzTplProvider>)
  },
  {
    path:"/admin/zzz-tpls/",
    component: (<Redirect to="/admin/zzz-tpls/1" />)
  },  
]