import {APIFY_BASEURL} from "../config/constants"
import axios from "axios"
import {is_undefined, pr, get_error} from "../helpers/functions"
import db from "../helpers/localdb"

const Apiauth = {

  async_get_apifytoken: async (objlogin)=>{

    const url = `${APIFY_BASEURL}/apify/security/login`
    
    try {
      const data = new FormData()
      //data.append("apify-origindomain","*")
      data.append("user",objlogin.username)
      data.append("password",objlogin.password)
      
      console.log("apidb.async_get_apifytoken",url)
      const response = await axios.post(url, data)

      console.log("apidb.async_get_apifytoken.response",response)
      //pr(response)
      if(is_undefined(response.data.data.token))
        throw new Error("Wrong data received from server. No token")

      return response.data.data.token
    } 
    catch (e) {
      console.error("ERROR: apidb.async_get_apifytoken.url:",url,"e:",e)
      return get_error(e)
    }
  },//async_get_apifytoken

  async_is_validtoken: async () => {
    const apifytoken = db.select("token_dbsapify")
    //pr(apifytoken,"async_is_valid_token recuperado de db");
    const url = `${APIFY_BASEURL}/apify/security/is-valid-token`
    try {
      const data = new FormData()
      //data.append("apify-origindomain","*")
      data.append("apify-usertoken",apifytoken)

      console.log("apidb.async_is_validtoken.url",url)
      
      const response = await axios.post(url,data)
      console.log("apidb.async_is_validtoken.response raw",response)
      //pr(response,"async_is_valid_token")
      
      if(is_undefined(response.data.data.isvalid))
        throw new Error("Wrong data received from server. Token validation")

      return response.data.data.isvalid
    } 
    catch (e) {
      console.error("ERROR: apidb.async_is_validtoken.url:",url,"e:",e)
      return get_error(e)
    }    
  },

}//Apiauth

export default Apiauth;