import {APIFY_BASEURL} from "config/constants"
import axios from "axios"
import {is_undefined, get_error} from "../functions"
import db from "../localdb"

const Apifyauth = {

  async_get_apifytoken: async (objlogin)=>{

    const url = `${APIFY_BASEURL}/apify/security/login`
    
    try {
      const data = new FormData()
      data.append("apify-user",objlogin.username)
      data.append("apify-password",objlogin.password)
      const response = await axios.post(url, data)
      window.lg("async_get_apifytoken.response", response)
      if(is_undefined(response.data.data.token))
        throw new Error("Wrong data received from server. No token")

      return response.data.data.token
    } 
    catch (e) {
      console.error("ERROR: apify.async_get_apifytoken.url:",url,"e:",e)
      return get_error(e)
    }
  },//async_get_apifytoken

  async_is_validtoken: async () => {
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/security/is-valid-token`
    try {
      const data = new FormData()
      data.append("apify-usertoken",apifytoken)
      const response = await axios.post(url,data)
      window.lg("async_is_validtoken.response", response)
      if(is_undefined(response.data.data.isvalid))
        throw new Error("Wrong data received from server. Token validation")
      return response.data.data.isvalid
    } 
    catch (e) {
      console.error("ERROR: apify.async_is_validtoken.url:",url,"e:",e)
      return get_error(e)
    }    
  },

  async_get_encrypt: async () => {
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/security/encrypt`
    try {
      const data = new FormData()
      data.append("apify-usertoken", apifytoken)
      const response = await axios.post(url, data)
      window.lg("async_get_encrypt", response)
      return response.data.data
    }
    catch (e) {
      return get_error(e)
    }
  },

}//Apifyauth

export default Apifyauth;