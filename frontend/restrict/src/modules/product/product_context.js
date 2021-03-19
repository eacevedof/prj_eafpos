//product_context.js
import React, {createContext, useState} from 'react';
export const ProductContext = createContext();

const ProductProvider = (props) => {
  const [someglobal, set_someglobal] = useState("")
  
  return (
    <ProductContext.Provider
      value={{
        someglobal, set_someglobal
      }}
    >
      {props.children}
    </ProductContext.Provider>
  )
}

export default ProductProvider