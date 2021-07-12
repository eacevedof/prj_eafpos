import React from "react"
import Child from "./child"
import {NavLink} from "react-router-dom";

function TestIndex() {

  return (
    <>
      <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin"}>Admin</NavLink>
      <h1>Test Index</h1>
      <Child />
    </>
  )
}

export default TestIndex;
