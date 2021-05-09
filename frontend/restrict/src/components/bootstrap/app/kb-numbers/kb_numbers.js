import { findLastIndex } from 'lodash';
import React, { useState } from 'react';

function KbNumbers({message, type}) {

  const [input, set_input] = useState("")

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
    <div style={css.container}>
   
      <div className="d-flex justify-content-center bd-highlight mt-2">
        <div className="p-1 input-group" style={css.divinput}>
          <input type="password" className="form-control" style={css.input}
            value={input}
            onChange={updateform}
            readOnly="readonly"
          />
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btndel}
            onClick={on_clear}
          >&lt;</button>
        </div>
      </div>        
      
      <div className="d-flex justify-content-center bd-highlight">
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(7)}
          >7</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(8)}
          >8</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(9)}
          >9</button>
        </div>
      </div>  
      
      <div className="d-flex justify-content-center bd-highlight">
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(4) }
          >4</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(5)}
          >5</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(6)}
          >6</button>
        </div>
      </div>

      <div className="d-flex justify-content-center bd-highlight">
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(1) }
          >1</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(2)}
          >2</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(3)}
          >3</button>
        </div>
      </div>      

      <div className="d-flex justify-content-center bd-highlight">
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={on_nok}
          >X</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(0)}
          >0</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={on_ok}
          >OK</button>
        </div>
      </div>     
    </div>
  )
}

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
    width: "500px",
    height: "500px",
    //border: "1px solid red"
    backgroundColor: "#4A4A4B",
  },

  btn : {
    width: "145px",
    height: "85px",
    fontSize: "32px",
    fontWeight: "bold",
  },

  divinput: {
    //border: "1px solid red",
    width: "305px",
  },

  input: {
    fontSize: "32px",
    fontWeight: "bold",    
  },  

  btndel : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "150px",
    height: "50px",
    fontSize: "32px",
    fontWeight: "bold",
  }    
}

export default KbNumbers;
