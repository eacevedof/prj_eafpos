import React, {useEffect, useState} from "react"

//el componente se renderiza nuevamente si le llegan las variables de las propiedades
console.log("child pre")
function Child({msg1, msg2}){
  const [child, set_child] = useState("- child -")
  console.log("child in:", child)

  /*
  useEffect(()=>{
    //esta funcion solo se dispara si hay un cambio en la variable msg1 pq la esta escuchando.
    //si hay un cambio en msg1 primero se ejecut el unmount y despues el mount
    console.log("child mounting", msg1, msg2)

    return ()=> console.log("child unmounting por:", msg1, msg2)
  },[msg1])

   */
  return (
    <>
      {console.log("child return")}
      <div className="container">
        <p>params in <br/>child. msg1:{msg1} <br/>msg2:{msg2}</p>
        <h6>child state: {child}</h6>
        <button className="btn btn-secondary" onClick={() => set_child("clicked child state")}> just state</button>
      </div>
    </>
  )
}

export default Child;
