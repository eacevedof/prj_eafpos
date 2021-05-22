import React, {createContext, useState} from "react"
export const ZzzTplContext = createContext()

const ZzzTplProvider = props => {
  const [someglobal, set_someglobal] = useState("")
  
  return (
    <ZzzTplContext.Provider
      value={{
        someglobal, set_someglobal
      }}
    >
      {props.children}
    </ZzzTplContext.Provider>
  )
}

export default ZzzTplProvider