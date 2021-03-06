import React, {memo} from "react"
import { NavLink } from "react-router-dom"
import shortid from "shortid"


const get_li = objli => (
    <li key={shortid.generate()} className="breadcrumb-item">
        <NavLink exact to={objli.url}>
            {objli.text}
        </NavLink>
    </li>
)

const get_lis = urls => urls.map((objli) => get_li(objli))
//https://v5.getbootstrap.com/docs/5.0/components/breadcrumb/
function Breadscrumb({urls}) {

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {get_lis(urls)}
      </ol>
    </nav>
  )
}

export default memo(Breadscrumb)