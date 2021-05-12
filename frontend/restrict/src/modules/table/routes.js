import React from 'react';
import {Redirect} from "react-router-dom"

import TableProvider from "modules/table/table_context"

import TableIndex from "modules/table/table_index"
import TableInsert from "modules/table/forms/table_insert"
import TableClone from "modules/table/forms/table_clone"
import TableUpdate from "modules/table/forms/table_update"
import TableDetail from "modules/table/forms/table_detail"
import TableDelete from "modules/table/forms/table_delete"
import TableDeleteLogic from "modules/table/forms/table_deletelogic"

export const routes = [
  {
    path:"/admin/table/insert",
    component: (<TableInsert />)
  },
  {
    path:"/admin/table/:id",
    component: (<TableDetail />)
  },
  {
    path:"/admin/table/update/:id",
    component: (<TableUpdate />)
  }, 
  {
    path:"/admin/table/delete/:id",
    component: (<TableDelete />)
  },     
  {
    path:"/admin/table/delete-logic/:id",
    component: (<TableDeleteLogic />)
  },  
  {
    path:"/admin/table/clone/:id",
    component: (<TableClone />)
  },  
  {
    path:"/admin/tables/:page(\\d+)",
    //se necesita el provider para arrastrar los filtros por las páginas
    component: (<TableProvider><TableIndex /></TableProvider>)
  },
  {
    path:"/admin/tables/",
    component: (<Redirect to="/admin/tables/1" />)
  },  
]