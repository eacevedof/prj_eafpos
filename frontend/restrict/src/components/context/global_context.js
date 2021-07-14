import React, {createContext, useState} from "react"

export const GlobalContext = createContext();

console.log("global.provider - out")
const GlobalProvider = (props) => {
  console.log("global.provider")

  const [errorg, set_errorg] = useState({})
  const [successg, set_successg] = useState({})
  const [warningg, set_warningg] = useState({})

  const [user, set_user] = useState({})
  const [apifytoken, set_apifytoken] = useState("")

  const [products, set_products] = useState([])
  const [search, set_search] = useState("")
  const [order, set_order] = useState({})
  const [order_total, set_order_total] = useState(0)
  const [selproduct, set_selproduct] = useState({})
  const [is_loading, set_is_loading] = useState(false)

  //esto publica todo lo que va estar disponible hacia afuera
  return (
    <GlobalContext.Provider
      value={{
        apifytoken, set_apifytoken,
        errorg, set_errorg, successg, set_successg, warningg, set_warningg,
        products, set_products, search, set_search, order, set_order,
        selproduct, set_selproduct, user, set_user, is_loading, set_is_loading,
        order_total, set_order_total
      }}
    >
      {console.log("global.provider return")}
      {props.children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider