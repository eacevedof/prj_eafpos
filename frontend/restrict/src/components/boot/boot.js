import React, {useContext, useEffect} from 'react';
import {GlobalContext} from 'components/context/global_context';

import db from "helpers/localdb"
import {async_gettoken, async_islogged} from "modules/login/login_index"

import {routes as dashroutes} from 'modules/dashboard/routes';
import {routes as prodroutes} from "modules/product/routes"

import E404 from "modules/errors/404/e404"

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function Boot() {

  const routes = [].concat(dashroutes, prodroutes)
  const {set_apifytoken, set_errorg} = useContext(GlobalContext)

  const async_onload = async () => {
    let apifytoken = ""
    //lee el token de la bd y lanza peticion al serv para comprobar si es correcta
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
        {routes.map((obj,i) => (<Route key={i} path={obj.path} exact>{obj.component}</Route>))}

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
