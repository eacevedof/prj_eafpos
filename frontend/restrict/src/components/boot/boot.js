import React, {useCallback, useContext, useEffect} from "react"
import {GlobalContext} from "components/context/global_context"
import Session from "components/common/session"
import db from "helpers/localdb"
import {async_gettoken, async_islogged} from "modules/login/async/login_checker"

import {routes as prodroutes} from "modules/adm-app-product/routes"
import {routes as posroutes} from "modules/pos-dashboard/routes"
import {routes as dashroutes} from "modules/adm-dashboard/routes"
import {routes as loginroutes} from "modules/login/routes"
import {routes as tableroutes} from "modules/adm-app-table/routes"
import {routes as tableposroutes} from "modules/pos-table/routes"

import E404 from "modules/errors/404/e404"

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function Boot() {

  const routes = [].concat(
    dashroutes, prodroutes,loginroutes, posroutes, tableroutes,
    tableposroutes
  )

  const {set_apifytoken, set_errorg} = useContext(GlobalContext)

  const async_onload = async () => {
    let apifytoken = ""
    const islogged = await async_islogged()

    if(islogged){
      apifytoken = db.select("token_dbsapify")
    }
    else {
      apifytoken = await async_gettoken()
      db.save("token_dbsapify",apifytoken)
    }

    console.log("boot.apifytoken:",apifytoken)
    if(!apifytoken){
      set_errorg({title:"Error", message:"Empty token"})
      db.delete("token_dbsapify")
    }
    else
      set_errorg({})
    
    set_apifytoken(apifytoken)

  }// async_onload

  useEffect(() => {
    console.log("boot.useeffect")
    async_onload()
  }, []);

  return (
    <Router>
      <Switch>
        {routes.map((obj,i) => (
            <Route key={i} path={obj.path} exact><Session component={obj.component} /></Route>
        ))}

        <Route path="/admin/order">
          <>orders</>
        </Route>

        <Route path="/admin/client">
          <>clients</>
        </Route>

        <Route path="*" exact={true} status={404}>
          <E404/>
        </Route>

      </Switch>
    </Router>
  )

}//Boot


export default Boot;
