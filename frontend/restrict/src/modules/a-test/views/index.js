import React, {useEffect} from "react"
import {NavLink} from "react-router-dom"
import Child from "./child"

function TestIndex() {

  useEffect(()=>{
    console.log("parent mounting")
    return ()=> console.log("parent unmounting")
  },[])

  return (
    <>
      <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin"}>Admin</NavLink>
      <h1>Test Index</h1>
      <Child msg1={"hola"} msg2={"mundo"} />
    </>
  )
}

export default TestIndex;
