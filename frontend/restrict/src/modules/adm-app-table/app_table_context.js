import React, {createContext, useState} from "react"
export const AppTableContext = createContext()

const AppTableProvider = props => {
  const [someglobal, set_someglobal] = useState("")
  
  return (
    <AppTableContext.Provider
      value={{
        someglobal, set_someglobal
      }}
    >
      {props.children}
    </AppTableContext.Provider>
  )
}

export default AppTableProvider