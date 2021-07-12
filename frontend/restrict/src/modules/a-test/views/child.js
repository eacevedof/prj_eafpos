import React, {useEffect} from "react"

function Child({msg1, msg2}){

  useEffect(()=>{
    console.log("child mounting")
    return ()=> console.log("child unmounting")
  },[])

  return (
    <>
      <div className="container">
        <h3>im a child</h3>
        <h4>{msg1}</h4>
        <h5>{msg2}</h5>
      </div>
    </>
  )
}

export default Child;
