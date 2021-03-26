import axios from "axios"
//import get_localip from "../../helpers/get_localip"
const APIFY_BASEURL = process.env.ENV_APIFY_BASEURL


const Api = {
  //localip: get_localip(),

  get_async_products: async (search="") => {
    const url = `${APIFY_BASEURL}/api/v1/products?page=1&perpage=100&s=${search}`
    
    try {
      console.log("api.get_async_products...",url)
      const response = await axios({url,method:"GET"}) 
      console.log("api.get_async_products.response",response)
      return response
    } catch (e) {

      console.error("ERROR: api.get_async_products.url:",url,"e:",e)
      return {
        error: "Error fetching products"
      }      
    }
  },

  get_async_chekcemail: async (email) => {
    const url = `${APIFY_BASEURL}/api/v1/user/email`
    
    try {
      const data = new FormData()
      data.append("email",email)
      //const extra = {headers: {"Content-Type": "application/json"}}
      //data["gogogo"] = "uuuu"
      //console.log(" email to send: ",data)
      console.log("api.get_async_chekcemail...",url)
      const response = await axios.post(url,data)
      //const response = await axios({url,method:"post", data})
      //const response = await axios.post(url,data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      //const response = await axios.post(url,data,{headers: {'Content-Type': 'application/json'}}) //no va!
      //const response = await axios.post(url,data,{headers: {'Content-Type': 'application/form-data'}}) //no va!
      //const response = await axios.post(url,data,extra)
      //const response = await axios({url, method:"get"})
      console.log("api.get_async_chekcemail.response",response)
      return response
    } catch (e) {
      console.error("ERROR: api.get_async_chekcemail.url:",url,"e:",e)
      return {
        error: "Error echecking user email"
      }      
    }
  },

  send_async_order: async (formdata) => {
    const url = `${APIFY_BASEURL}/api/v1/order/purchase`
    
    try {
      console.log("api.send_async_order...",url)
      const response = await axios.post(url, formdata)
      console.log("api.send_async_order.response",response)
      return response
    } catch (e) {
      console.error("ERROR: api.send_async_order.url:",url,"e:",e)
      return {
        error: "Error submitting order"
      }
    }
  },
  
}

export default Api;