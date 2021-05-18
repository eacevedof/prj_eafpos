//table_context.js
import React, {createContext, useState} from 'react';
export const TableContext = createContext();

const TableProvider = (props) => {
  const [someglobal, set_someglobal] = useState("")
  
  return (
    <TableContext.Provider
      value={{
        someglobal, set_someglobal
      }}
    >
      {props.children}
    </TableContext.Provider>
  )
}

export default TableProvider