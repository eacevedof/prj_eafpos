import React from 'react';
import {Redirect} from "react-router-dom"

import LoginProvider from "modules/Login/Login_context"

import LoginIndex from "modules/Login/Login_index"
import LoginInsert from "modules/Login/forms/Login_insert"
import LoginClone from "modules/Login/forms/Login_clone"
import LoginUpdate from "modules/Login/forms/Login_update"
import LoginDetail from "modules/Login/forms/Login_detail"
import LoginDelete from "modules/Login/forms/Login_delete"
import LoginDeleteLogic from "modules/Login/forms/Login_deletelogic"

export const routes = [
  {
    path:"/admin/Login/insert",
    component: (<LoginInsert />)
  },
  {
    path:"/admin/Login/:id",
    component: (<LoginDetail />)
  },
  {
    path:"/admin/Login/update/:id",
    component: (<LoginUpdate />)
  }, 
  {
    path:"/admin/Login/delete/:id",
    component: (<LoginDelete />)
  },     
  {
    path:"/admin/Login/delete-logic/:id",
    component: (<LoginDeleteLogic />)
  },  
  {
    path:"/admin/Login/clone/:id",
    component: (<LoginClone />)
  },  
  {
    path:"/admin/Logins/:page(\\d+)",
    //se necesita el provider para arrastrar los filtros por las páginas
    component: (<LoginProvider><LoginIndex /></LoginProvider>)
  },
  {
    path:"/admin/Logins/",
    component: (<Redirect to="/admin/Logins/1" />)
  },  
]