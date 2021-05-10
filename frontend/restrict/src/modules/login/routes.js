import React from 'react';
import {Redirect} from "react-router-dom"

import LoginProvider from "modules/login/login_context"

import LoginIndex from "modules/login/login_index"
import LoginCheck from "modules/login/forms/login_check"
/*
import LoginClone from "modules/login/forms/login_clone"
import LoginUpdate from "modules/login/forms/login_update"
import LoginDetail from "modules/login/forms/login_detail"
import LoginDelete from "modules/login/forms/login_delete"
import LoginDeleteLogic from "modules/login/forms/login_deletelogic"
*/

export const routes = [
  {
    path:"/",
    component: (<LoginCheck />)
  },
]