import React from "react"
import {Redirect} from "react-router-dom"

import AppTableProvider from "modules/adm-app-table/app_table_context"

import AppTableIndex from "modules/adm-app-table/views/index"
import AppTableInsert from "modules/adm-app-table/views/form_insert"
import AppTableClone from "modules/adm-app-table/views/form_clone"
import AppTableUpdate from "modules/adm-app-table/views/form_update"
import AppTableDetail from "modules/adm-app-table/views/form_detail"
import AppTableDelete from "modules/adm-app-table/views/form_delete"
import AppTableDeleteLogic from "modules/adm-app-table/views/form_deletelogic"

export const routes = [
  {
    path:"/admin/app-table/insert",
    component: (<AppTableInsert />)
  },
  {
    path:"/admin/app-table/:id",
    component: (<AppTableDetail />)
  },
  {
    path:"/admin/app-table/update/:id",
    component: (<AppTableUpdate />)
  }, 
  {
    path:"/admin/app-table/delete/:id",
    component: (<AppTableDelete />)
  },     
  {
    path:"/admin/app-table/delete-logic/:id",
    component: (<AppTableDeleteLogic />)
  },  
  {
    path:"/admin/app-table/clone/:id",
    component: (<AppTableClone />)
  },  
  {
    path:"/admin/app-tables/:page(\\d+)",
    component: (<AppTableProvider><AppTableIndex/></AppTableProvider>)
  },
  {
    path:"/admin/app-tables/",
    component: (<Redirect to="/admin/app-tables/1" />)
  },  
]