import React from 'react';
import {is_dev, is_prod} from "helpers/env"

function Devstripe() {
  
  const style = {
    height:"5px",
    width:"100%",
    background:"orange",
  }

  if(is_dev())
    return (<div className="fixed-top" style={style}></div>)

  return null
}

export default Devstripe;
