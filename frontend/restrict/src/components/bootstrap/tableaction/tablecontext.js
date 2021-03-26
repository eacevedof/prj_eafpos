//tablecontext.js
import React, {createContext, useState} from 'react';

export const TableContext = createContext();

const TableProvider = props => {
  
  const [ismultiaction, set_ismultiaction] = useState(false) //si el check multi se ha activado
  const [multiaction, set_multiaction] = useState("") //la función a ejecutar
  const [multivalues, set_multivalues] = useState([]) //las claves
  
  return (
    <TableContext.Provider
      value={{
        ismultiaction, set_ismultiaction,
        multiaction, set_multiaction,
        multivalues, set_multivalues,
      }}
    >
      {props.children}
    </TableContext.Provider>
  )
  
}

export default TableProvider