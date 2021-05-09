//Login_context.js
import React, {createContext, useState} from 'react';
export const LoginContext = createContext();

const LoginProvider = (props) => {
  const [someglobal, set_someglobal] = useState("")
  
  return (
    <LoginContext.Provider
      value={{
        someglobal, set_someglobal
      }}
    >
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginProvider