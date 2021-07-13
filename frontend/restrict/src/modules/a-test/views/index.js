import React, {memo, useEffect, useMemo, useState} from "react"
import {NavLink} from "react-router-dom"
import Child from "./child"

function TestIndex() {
  console.log("function Parent")
  const [msgd, set_msgd] = useState("-")

/*
  useEffect(()=>{
    console.log("parent mounting")
    return ()=> console.log("parent unmounting")
  },[])
*/

  return (
    <>
      <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin"}>Admin</NavLink>
      <button onClick={() => set_msgd("ab-c")}>Set msgd en parent</button>
      <h1>Test Index</h1>
      <Child msg1={msgd} msg2={"mundo"} />
    </>
  )
}

export default memo(TestIndex);
