import React, {createContext, useState} from "react"
export const ZzzTplContext = createContext()

const ZzzTplProvider = props => {
  const [zzztpl, set_zzztpl] = useState("")
  
  return (
    <ZzzTplContext.Provider
      value={{
        zzztpl, set_zzztpl
      }}
    >
      {props.children}
    </ZzzTplContext.Provider>
  )
}

export default ZzzTplProvider