import React from 'react';
import { NavLink } from "react-router-dom";
import shortid from "shortid"

//import {GlobalContext} from '../../context/global_context';

//https://v5.getbootstrap.com/docs/5.0/components/breadcrumb/
function Breadscrumb({urls}) {

  const get_li = objli => (
    <li key={shortid.generate()} className="breadcrumb-item">
      <NavLink exact to={objli.url}>
        {objli.text}
      </NavLink>       
    </li>
  )

  const get_lis = urls => urls.map((objli) => get_li(objli))

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {get_lis(urls)}
      </ol>
    </nav>
  )
}

export default Breadscrumb;
