import React, {memo, useEffect, useMemo, useState} from "react"
import {NavLink} from "react-router-dom"
import Child from "./child"

console.log("parent pre")
function Parent() {
  console.log("parent in")
  //duda sobre esta linea: Pq cuando la comento solo se ejecuta el return 1 vez?
  const [msgp, set_msgp] = useState("-")
/*
  useEffect(()=>{
    console.log("parent mounting")
    return ()=> console.log("parent unmounting")
  },[])
*/
  return (
    <div className="container">
      <br/>
      {console.log("parent return")}
      <NavLink className="btn btn-primary" activeClassName="navlink-active" exact to={"/admin"}>Admin</NavLink>
        <button className="btn btn-warning" onClick={() => set_msgp("ab-c")}>Set msgp en parent</button>
        <h1>Test Index</h1>
        <Child msg1={msgp} msg2={"mundo"} />
    </div>
  )
}

//export default memo(Parent);
export default Parent
