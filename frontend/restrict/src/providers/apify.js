import {APIFY_BASEURL, APIFY_CONTEXT, APIFY_SCHEMA} from "../config/constants"
import axios from "axios"
import db from "helpers/localdb"
import auth from "providers/apifyauth"
import {is_undefined, get_error} from "helpers/functions"
import get_encrypted, {get_delete_form, get_select_form, get_update_form, get_insert_form} from "helpers/encrypt"

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
      console.error("ERROR: apify.async_get_fields.url:",url,"e:",e)
      return get_error(e)
    }    
  },

  async_get_list: async objselect => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/read?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    //hay que enviar header: apify-auth: token
    try {

      //const encrypt = await auth.async_get_encrypt()
      const encrypt = db.select("apify-encrypt");
      //debugger
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objselect.get_self()
        window.lg("query",query)
        console.time("get_select_form")
        objform = get_select_form(query, fnencrypt)
        console.timeEnd("get_select_form")
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objselect.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objselect.reset()
      const response = await axios.post(url, objform)

      if(is_undefined(response.data.data))
        throw new Error("Wrong data received from server. Resultset")

      return response.data.data
    } 
    catch (e) {
      console.error("ERROR: apify.async_get_list.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_insert: async (objinsert) => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      //const encrypt = await auth.async_get_encrypt()
      const encrypt = db.select("apify-encrypt");
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objinsert.get_self()
        objform = get_insert_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objinsert.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objinsert.reset()
      const response = await axios.post(url, objform)

      if(is_undefined(response.data.data.lastid))
        throw new Error("Wrong data received from server. insert lastid")

      return response.data.data.lastid
    } 
    catch (e) {
      console.error("ERROR: apify.async_insert.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_update: async (objupdate) => {
    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      //const encrypt = await auth.async_get_encrypt()
      const encrypt = db.select("apify-encrypt");
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objupdate.get_self()
        objform = get_update_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objupdate.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objupdate.reset()
      const response = await axios.post(url, objform)

      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Update result")

      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apify.async_update.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_delete: async (objdelete) => {

    const apifytoken = db.select("token_apify")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      //const encrypt = await auth.async_get_encrypt()
      const encrypt = db.select("apify-encrypt");
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objdelete.get_self()
        objform = get_update_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objdelete.get_form()
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objdelete.reset()
      const response = await axios.post(url, objform)

      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Delete result")

      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apify.async_delete.url:",url,"e:",e)
      return get_error(e)
    }
  }, //async_delete

}//apify


export default Apify;