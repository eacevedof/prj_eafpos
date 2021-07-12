import React, {useEffect, useState} from "react"

//el componente se renderiza nuevamente si le llegan las variables de las propiedades
function Child({msg1, msg2}){

  const [ch, set_ch] = useState(":)")

  useEffect(()=>{
    //esta funcion solo se dispara si hay un cambio en la variable msg1 pq la esta escuchando.
    //si hay un cambio en msg1 primero se ejecut el unmount y despues el mount
    console.log("child mounting", msg1, msg2)

    return ()=> console.log("child unmounting por:", msg1, msg2)
  },[msg1])

  return (
    <>
      <div className="container">
        <h3>im a child</h3>
        <h4>{msg1}</h4>
        <h5>{msg2}</h5>
        <h6>ch: {ch}</h6>
        <button className="btn btn-secondary" onClick={() => set_ch("some child")}> just state</button>
      </div>
    </>
  )
}

export default Child;
