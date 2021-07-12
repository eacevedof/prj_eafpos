import React, {useEffect} from "react"

//el componente se renderiza nuevamente si le llegan las variables de las propiedades
function Child({msg1, msg2}){

  useEffect(()=>{
    //esta funcion solo se dispara si hay un cambio en la variable msg1 pq la esta escuchando
    console.log("child mounting", msg1)
    return ()=> console.log("child unmounting por:", msg1)
  },[msg1])

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
