import shortid from "shortid"

export const is_undefined = mxvar => (typeof mxvar === "undefined")

export const is_defined = mxvar => (typeof mxvar !== "undefined")

export const isset = mxvar => mxvar!==null && is_defined(mxvar)

export const is_key = (obj,k) => Object.keys(obj).filter(ki=>ki==k).length>0

export const pr = (mxvar,title="") => {
  console.log("pr:",title,mxvar)
  alert(title+":\n"+JSON.stringify(mxvar))
}

export const is_object = mxvar => (typeof mxvar == "object")

export const get_error = objerr => ({"error": objerr.toString().replace("Error:","").trim()})

export const is_objectlit = objany => isset(objany) ? is_defined(objany.constructor) ? objany.constructor == Object : false : false

export const get_keys = objany => !is_objectlit(objany) ? [] : Object.keys(objany)

export const is_empty = objany => !isset(objany) ? true : ( is_defined(objany.length) ? objany.length===0 : (is_objectlit(objany) && get_keys(objany).length == 0) )

export const cl = (objany, title="") => console.log(title, objany)

export const get_datenow = () => {
  //2020-07-14T14:26:27.926Z
  const timenow = new Date().toISOString().slice(0,24);
  const parts = timenow.split("T")
  const strdate = parts[0].split("-").join("")
  const strtime = parts[1].split(".")[0].split(":").join("")
  const r = strdate.concat(strtime) 
  console.log("get_datenow.r",r)
  return r
}

export const is_string = objany =>  (typeof objany === 'string' || objany instanceof String)

export const get_urlvalue = (strkey, url) => {
  if (!url) url = window.location.href
  const name = strkey.replace(/[\[\]]/g, '\\$&')

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
  
  if (!results) return ""
  if (!results[2]) return ""
  
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
  
}

export const get_pages = (itotal, iperpage) => iperpage>0 ? Math.ceil(parseInt(itotal) / iperpage) : 0

export const get_pagefrom = (ipage, iperpage) => ((ipage<1 ? 1 : ipage) - 1) * iperpage

export const get_uuid = () => shortid.generate()

export const get_uuid2 = ()=>{
  const strchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const char = (strchars.split(""))[Math.floor(Math.random()*(strchars.length-1))]
  const rnd = char.concat((Math.floor((Math.random()*100)+1)).toString())
  return rnd
}

export const get_localip = () => {
  let arIp = []
  window.RTCPeerConnection = (window.RTCPeerConnection || window.mozRTCPeerConnection || 
                              window.webkitRTCPeerConnection || false)

  if(window.RTCPeerConnection){
    
    const peerconn = new RTCPeerConnection({iceServers:[]})
    //pr(peerconn,"peercon")
    const noop = function(){}

    peerconn.createDataChannel("")
    //peerconn.createOffer(peerconn.setLocalDescription.bind(peerconn), noop)
    peerconn.createOffer().then(function(sdp){
      const ar = sdp.sdp.split("\n")
      arIp.push(ar[0].split(' ')[4]);
    })

    peerconn.onicecandidate = function(event){
      if (!event || !event.candidate || !event.candidate.candidate) return;
      event.candidate.candidate.forEach(x => {
        arIp.push(x)
      });
    }

  }

  return arIp;
}