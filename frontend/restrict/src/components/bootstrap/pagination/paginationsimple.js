import React, {useEffect, useState, useRef} from 'react'
import { pr } from 'helpers/functions'
import { NavLink } from "react-router-dom"
import shortid from "shortid"


function PaginationSimple({objconf}){

  const urlpattern = objconf.url
  const ipage = parseInt(objconf.page)
  const foundrows = parseInt(objconf.foundrows)
  const ippage = parseInt(objconf.ippage)

  const [npages, set_npages] = useState(0)
  const [urls, set_urls] = useState([])

  const get_uuid = () => shortid.generate()
  
  const get_buttons = (ipage,ipages) => {

    if(ipages==0) return []
    if(ipages==1) return []

    const ibuttons = 3
    const ihalf = Math.ceil(ibuttons/2)

    //botones por izq y derecha
    const idistleft = ipage - 1
    const idistright = ipages - ipage

    let icomplleft=0, icomplright=0, ireall=0, irealr=0

    if(idistleft >= ihalf){
      ireall = ihalf
    }
    else{
      ireall = idistleft
      icomplright = ihalf - idistleft
    }

    if(idistright >= ihalf){
      irealr = ihalf
    }
    else{
      irealr = idistright
      icomplleft = ihalf - idistright
    }    

    ireall = ireall + icomplleft
    irealr = irealr + icomplright
   
    //pr(`page:${ipage}, left:${ireall}, right:${irealr}`)

    let buttons = []
    for(let i=1; i<=ireall; i++) buttons.push(ipage - i)
    buttons.push(ipage)
    for(let i=1; i<=irealr; i++) buttons.push(ipage + i)

    buttons = buttons.sort((a,b) => a-b)
    buttons = [1,...buttons,ipages]
    buttons = Array.from(new Set(buttons)).filter(i => i>0 && i<=ipages)
    return buttons
  }

  const get_npages = (totrows, ippage) => ippage>0 ? Math.ceil(totrows / ippage) : 0

  const on_load = () => {
    //pr(objconf,"obconf")
    const ipages = get_npages(foundrows, ippage)
    if(ipages<2){
      set_npages(ipages)
      set_urls([])
      return 
    }
    
    const buttons = get_buttons(ipage, ipages)
    //pr(buttons,"buttons")
    const arurls = [...Array(ipages).keys()].filter(i => buttons.includes(i+1)).map(ipage => ({url:urlpattern.replace("%page%",ipage+1), text:ipage+1}))

    //si hay boton con puntos [...]
    const hops = []
    //si el segundo no es igual al primero + 1
    if(buttons[1] !== (buttons[0]+1)) hops.push(1)
    //si el ultimo no es igual al penultimo + 1
    if(buttons[buttons.length-1] !== (buttons[buttons.length-2]+1)) hops.push(buttons.length-1)
  
    if(hops.length===1) arurls.splice(hops[0],0,{url:"...",text:".0."})
    else if(hops.length===2) {
      arurls.splice(hops[0],0,{url:"...",text:".1."})
      arurls.splice(hops[1]+1,0,{url:"...",text:".2."})
    }

    //console.log("hops",hops)
    //pr(arurls,"arurls")
    set_npages(ipages)
    set_urls(arurls)
    //console.log("paginationsimple.on_load:","ipage",ipage,"foundrows",foundrows,"hops",hops,"ipages",ipages,"arurls",arurls)
  }

  useEffect(()=>{
    on_load()
    return ()=> console.log("paginationsimple unmounting")
  },[objconf.page, objconf.foundrows])


  const get_li_simple = (url, text) => (
    <li key={get_uuid()} className="page-item">
      <NavLink className="page-link" exact to={url}>{text}</NavLink>
    </li>
  )

  const get_li_active = (url, text) => (
    <li key={get_uuid()} className="page-item active">
      <NavLink className="page-link" exact to={url}>{text}</NavLink>
    </li>
  )

  const get_li_dotted = () => (<li key={get_uuid()}><span className="page-link spanhover">...</span></li>)
  
  const get_li_arrow = (type, ipage) => (
    <li key={get_uuid()} className="page-item">
      <NavLink className="page-link" exact to={urlpattern.replace("%page%",ipage)}>{type==="l" ? "\u00AB" : "\u00BB"}</NavLink>
    </li>
  )

  return (
    <nav className="d-flex justify-content-center">
      <ul className="pagination">
        { objconf.page >1 ? get_li_arrow("l", ipage-1) : null }

        {
          urls.map(objurl => 
            objurl.text==objconf.page ?
              get_li_active(objurl.url, objurl.text)
            : //si no es la página actual
              objurl.url==="..." ? get_li_dotted() : get_li_simple(objurl.url, objurl.text)
          )
        }
        
        { objconf.page < npages ? get_li_arrow("r", ipage+1) : null }
      </ul>
    </nav>
  )
}

export default PaginationSimple
