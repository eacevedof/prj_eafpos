import {APIFY_BASEURL, APIFY_CONTEXT, APIFY_SCHEMA} from "../../config/constants"
import axios from "axios"
import db from "helpers/localdb"
import auth from "helpers/providers/apifyauth"
import {is_undefined, get_error} from "helpers/functions"
import get_encrypted, {get_delete_form, get_select_form, get_update_form, get_insert_form, get_deletelogic_form} from "helpers/encrypt"

const get_code_cache = () => db.select("session_user")?.code_cache ?? ""

const Apify = {
  
  async_get_fields: async (table) =>{
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/fields/${APIFY_CONTEXT}/${APIFY_SCHEMA}/${table}`

    try{
      const objform = new FormData()
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())

      const response = await axios.post(url,objform)
      window.lg("async_get_fields", response?.data)
      if(is_undefined(response.data.data))
        throw new Error("Wrong data received from server. Get fields")
      return response.data.data
    }
    catch (e) {
      return get_error(e)
    }    
  },

  async_get_list: async objselect => {
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/read?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    //hay que enviar header: apify-auth: token
    try {
      const encrypt = await auth.async_get_encrypt()
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objselect.get_self()
        window.lg("query",query)
        objform = get_select_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objselect.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objselect.reset()

      const response = await axios.post(url, objform)
      window.lg("async_get_list", response?.data)

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
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const encrypt = await auth.async_get_encrypt()
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objinsert.get_self()
        window.lg("async_insert.query",query)
        objform = get_insert_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objinsert.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objinsert.reset()
      const response = await axios.post(url, objform)
      window.lg("async_insert.response", response?.data)

      if(is_undefined(response.data.data.lastid))
        throw new Error("Wrong data received from server. insert lastid")

      return response.data.data.lastid
    } 
    catch (e) {
      return get_error(e)
    }
  },

  async_update: async (objupdate) => {
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const encrypt = await auth.async_get_encrypt()
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objupdate.get_self()
        window.lg("async_update.query",query)
        objform = get_update_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objupdate.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objupdate.reset()
      const response = await axios.post(url, objform)
      window.lg("async_update.response", response?.data)
      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Update result")

      return response.data.data.result
    } 
    catch (e) {
      return get_error(e)
    }
  },

  async_deletelogic: async (objdeletelogic) => {
    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const encrypt = await auth.async_get_encrypt()
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objdeletelogic.get_self()
        window.lg("async_deletelogic.query", query)
        objform = get_deletelogic_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objdeletelogic.get_form()

      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objdeletelogic.reset()
      const response = await axios.post(url, objform)
      window.lg("async_deletelogic.response", response?.data)
      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. deletelogic result")

      return response.data.data.result
    }
    catch (e) {
      return get_error(e)
    }
  },

  async_delete: async (objdelete) => {

    const apifytoken = db.select("apify-token")
    const url = `${APIFY_BASEURL}/apify/write?context=${APIFY_CONTEXT}&schemainfo=${APIFY_SCHEMA}`

    try {
      const encrypt = await auth.async_get_encrypt()
      let objform = null
      if(encrypt) {
        const fnencrypt = get_encrypted(encrypt.alphabet)(encrypt.steps)
        const query = objdelete.get_self()
        window.lg("async_delete.query", query)
        objform = get_delete_form(query, fnencrypt)
        objform.append("apify-enckey", encrypt.key)
      }
      else
        objform = objdelete.get_form()
      objform.append("apify-usertoken", apifytoken)
      objform.append("useruuid", get_code_cache())
      objdelete.reset()
      const response = await axios.post(url, objform)
      window.lg("async_delete.response", response)

      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Delete result")

      return response.data.data.result
    } 
    catch (e) {
      return get_error(e)
    }
  }, //async_delete

}//apify


export default Apify;