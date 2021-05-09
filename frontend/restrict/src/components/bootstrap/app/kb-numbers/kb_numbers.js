import { findLastIndex } from 'lodash';
import React, { useState } from 'react';

function KbNumbers({message, type}) {

  const [input, set_input] = useState("")

  const css = {
    container : {
      position: "absolute",
      //display: "flex",
      top:0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto",
      padding: "3px",
      width: "510px",
      height: "505px",
      //border: "1px solid red"
      backgroundColor: "#4A4A4B",
    },

    button : {
      width: "160px",
      height: "95px",
      fontSize: "32px",
      fontWeight: "bold",
    },

    button_del : {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "155px",
      height: "57px",
      fontSize: "32px",
      fontWeight: "bold",
    }    
  }

  const on_clear = () => {
    set_input(input.slice(0,-1))
  }

  const on_nok = () => {
    set_input("")
  }

  const on_ok = () => {
    console.log("on_ok",input)
  }

  const on_click = (n) => {
    console.log(n)
    set_input(input.concat(n))
  }

  const updateform = ()=> {
    console.log(input)
  }

  return (
    <div className="container" style={css.container}>
      
      <div className="row">
        <div className="col-sm p-1 input-group input-group-lg">
          <input type="password" className="form-control" 
            value={input}
            onChange={updateform}
            readOnly="readonly"
          />
        </div>
        <div className="col-sm p-1">
          <button className="btn btn-primary" type="button" style={css.button_del}
            onClick={on_clear}
          >&lt;</button>
        </div>
      </div>        
      
      <div className="row pb-1">
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(7)}
          >7</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(8)}
          >8</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(9)}
          >9</button>
        </div>
      </div>  
      
      <div className="row pb-1">
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(4) }
          >4</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(5)}
          >5</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(6)}
          >6</button>
        </div>
      </div>

      <div className="row pb-1">
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(1) }
          >1</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(2)}
          >2</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(3)}
          >3</button>
        </div>
      </div>      

      <div className="row pb-1">
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={on_nok}
          >X</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={() => on_click(0)}
          >0</button>
        </div>
        <div className="col-sm p-0">
          <button className="btn btn-primary" type="button" style={css.button}
            onClick={on_ok}
          >OK</button>
        </div>
      </div>     
    </div>
  )
}

export default KbNumbers;
