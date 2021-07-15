import React from "react"
import {Redirect} from "react-router-dom"

import ProductProvider from "modules/adm-app-product/app-product_context"

import ProductIndex from "modules/adm-app-product/views"
import ProductInsert from "modules/adm-app-product/views/form_insert"
import ProductClone from "modules/adm-app-product/views/form_clone"
import ProductUpdate from "modules/adm-app-product/views/form_update"
import ProductDetail from "modules/adm-app-product/views/form_detail"
import ProductDelete from "modules/adm-app-product/views/form_delete"
import ProductDeleteLogic from "modules/adm-app-product/views/form_deletelogic"

export const routes = [
  {
    path:"/admin/product/insert",
    component: (<ProductInsert />)
  },
  {
    path:"/admin/product/:id",
    component: (<ProductDetail />)
  },
  {
    path:"/admin/product/update/:id",
    component: (<ProductUpdate />)
  }, 
  {
    path:"/admin/product/delete/:id",
    component: (<ProductDelete />)
  },     
  {
    path:"/admin/product/delete-logic/:id",
    component: (<ProductDeleteLogic />)
  },  
  {
    path:"/admin/product/clone/:id",
    component: (<ProductClone />)
  },  
  {
    path:"/admin/products/:page(\\d+)",
    //se necesita el provider para arrastrar los filtros por las páginas
    component: (<ProductProvider><ProductIndex /></ProductProvider>)
  },
  {
    path:"/admin/products/",
    component: (<Redirect to="/admin/products/1" />)
  },  
]