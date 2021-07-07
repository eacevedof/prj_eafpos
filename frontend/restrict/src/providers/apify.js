import {APIFY_BASEURL, APIFY_CONTEXT, APIFY_SCHEMA} from "../config/constants"
import axios from "axios"
import db from "helpers/localdb"
import auth from "providers/apiauth"
import {is_undefined, get_error} from "../helpers/functions"
import get_encrypted, {get_select_form}  from "helpers/encrypt";

const get_code_cache = () => db.select("session_user")?.code_cache ?? ""

const Apify = {
  
  async_get_fields: async (table) =>{
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/fields/${APIFY_CONTEXT}/${APIFY_SCHEMA}/${table}`

    try{
      const objform = new FormData()
      //objform.append("apify-origindomain","*")
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())

      const fields = await axios.post(url,objform)
      if(is_undefined(fields.data.data))
        throw new Error("Wrong data received from server. Get fields")
      return fields.data.data
    }
    catch (e) {
      console.error("ERROR: apidb.async_get_fields.url:",url,"e:",e)
      return get_error(e)
    }    
  },

  async_get_list: async objselect => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/read?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    //hay que enviar header: apify-auth: token
    try {

      const encrypt = await auth.async_get_encrypt()
      const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
      const query = objselect.get_self()

      const objform = get_select_form(query, fnencrypt())
      objform.append("apify-usertoken", apifytoken)
      objform.append("apify-enckey", encrypt.key)
      objform.append("useruuid", get_code_cache())

      const response = await axios.post(url, objform)

      if(is_undefined(response.data.data))
        throw new Error("Wrong data received from server. Resultset")

      return response.data.data
    } 
    catch (e) {
      console.error("ERROR: apidb.async_get_list.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_insert: async (objinsert) => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const objform = objinsert.get_query()
      //objform.append("apify-origindomain","*")
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())

      console.log("apidb.async_insert",url)
      const response = await axios.post(url, objform)
      //pr(response,"async_insert")
      console.log("apidb.async_insert.response",response)

      if(is_undefined(response.data.data.lastid))
        throw new Error("Wrong data received from server. insert lastid")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.lastid
    } 
    catch (e) {
      console.error("ERROR: apidb.async_insert.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_update: async (objupdate) => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`
    //hay que enviar header: apify-auth: token
    try {
 
      const objform = objupdate.get_query()
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      //objform.append("apify-origindomain","*")

      console.log("apidb.async_update",url)
      const response = await axios.post(url, objform)

      console.log("apidb.async_update.response",response)

      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Update result")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apidb.async_update.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_delete: async(objdelete) => {

    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const objform = objdelete.get_query()
      //objform.append("apify-origindomain","*")
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      
      console.log("apidb.async_delete",url)
      const response = await axios.post(url, objform)

      console.log("apidb.async_delete.response",response)
      //devuelve el num de registros afectados
      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Delete result")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apidb.async_delete.url:",url,"e:",e)
      return get_error(e)
    }
  }, //async_delete

}//Apidb


export default Apify;