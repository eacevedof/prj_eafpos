import React, {useCallback, useContext, useEffect} from "react"
import {GlobalContext} from "components/context/global_context"
import Session from "components/common/session"
import db from "helpers/localdb"
import {async_gettoken, async_is_tokenized} from "modules/pos-login/async/login_checker"

import {routes as prodroutes} from "modules/adm-app-product/routes"
import {routes as posroutes} from "modules/pos-dashboard/routes"
import {routes as dashroutes} from "modules/adm-dashboard/routes"
import {routes as loginroutes} from "modules/pos-login/routes"
import {routes as tableroutes} from "modules/adm-app-table/routes"
import {routes as tableposroutes} from "modules/pos-table/routes"
import {routes as testroutes} from "modules/a-test/routes"

import E404 from "modules/errors/404/e404"

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function Boot() {

  const routes = [].concat(
    dashroutes, prodroutes,loginroutes, posroutes, tableroutes,
    tableposroutes, testroutes
  )

  const {set_apifytoken, set_errorg} = useContext(GlobalContext)

  const async_onload = useCallback(async () => {
    let apifytoken = ""
    const islogged = await async_is_tokenized()

    if(islogged){
      apifytoken = db.select("apify-token")
    }
    else {
      apifytoken = await async_gettoken()
      db.save("apify-token", apifytoken)
    }

    if(!apifytoken){
      set_errorg({title:"Error", message:"Empty token"})
      db.delete("apify-token")
    }
    else
      set_errorg({})
    
    set_apifytoken(apifytoken)

  }, [set_apifytoken, set_errorg])// async_onload

  useEffect(() => {
    async_onload()
    return () => console.log("boot unmounting")
  }, [async_onload]);

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
