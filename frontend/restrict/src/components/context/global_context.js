import React, {createContext, useState, memo} from "react"

export const GlobalContext = createContext();

console.log("global.provider pre")
const GlobalProvider = (props) => {

  const [errorg, set_errorg] = useState({})
  const [successg, set_successg] = useState({})
  const [warningg, set_warningg] = useState({})

  //al setear algo en estas variables fuerza la renderización de todos los componentes hijos
  //esto publica todo lo que va estar disponible hacia afuera
  return (
    <GlobalContext.Provider
      value={{
        errorg, set_errorg, successg, set_successg, warningg, set_warningg
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  )
}

export default memo(GlobalProvider)