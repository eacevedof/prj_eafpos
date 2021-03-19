import axios from "axios"
import db from "helpers/localdb"
import {UPLOAD_BASEURL} from "config/constants"


const Apiupload = {
  
  async_post: async (inputfile) => {
    const url = `${UPLOAD_BASEURL}/upload`
    const uploadtoken = db.select("token_upload")
    
    if(!inputfile || inputfile.name==="") return {file_1:""}

    console.log("apiupload.async_post.inputfile",inputfile)

    if(!uploadtoken) throw "Upload token not found!"
    
    try {
      const data = new FormData()
      data.append("resource-usertoken",uploadtoken)
      data.append("folderdomain","elchalanaruba.com")
      data.append("file_1", inputfile)
      const response = await axios.post(url, data)
      //console.log("apiupload.async_post.response:",response)
      console.log("apiupload.async_post.response.data.data.url:",response.data.data.url)
      const objurl = response.data.data.url
      return objurl
    } 
    catch (e) {
      console.error("ERROR: apiupload.async_post.url:",url,"e:",e)
      return {
        error: "Error uploading file. "+e
      }      
    }
  },

  async_get_maxsize: async () => {
    const url = `${UPLOAD_BASEURL}/get-max-upload-size`
    const uploadtoken = db.select("token_upload")

    if(!uploadtoken) throw "Upload token not found!"
    
    try {
      const data = new FormData()
      data.append("resource-usertoken",uploadtoken)
      const response = await axios.post(url, data)
      console.log("apiupload.async_get_maxsize.response.data.data.maxuploadsize:",response.data.data.maxuploadsize)
      const size = response.data.data.maxuploadsize
      return size
    } 
    catch (e) {
      console.error("ERROR: apiupload.async_get_maxsize.url:",url,"e:",e)
      return {
        error: "Error getting upload size. "+e
      }      
    }
  },   

}

export default Apiupload;