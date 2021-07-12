import React, {useEffect} from "react"
import {NavLink} from "react-router-dom"
import Child from "./child"

function TestIndex() {

  useEffect(()=>{
    console.log("test mounting")
    return ()=> console.log("test unmounting")
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
