import React, { useState, useRef } from 'react';

function KbNumbers({onok, type}) {

  const maxlength = 6

  const [input, set_input] = useState("")
  const refinput = useRef(null)

  const on_clear = () => {
    set_input(input.slice(0,-1))
    refinput.current.focus()
  }

  const on_nok = () => {
    set_input("")
    refinput.current.focus()
  }


  const on_ok = () => {
    console.log("on_ok",input)
    onok()
    refinput.current.focus()
  }

  const on_click = (n) => {
    if(input.length<maxlength)
      set_input(input.concat(n))
    refinput.current.focus()
  }

  const on_change = (evt)=> {
    if(input.length<maxlength)
      set_input(evt.target.value)
  }

  const on_keyup = (evt) => {
    //console.log("evt",evt.key)
    if(input.length===maxlength){
      if(evt.key==="Backspace"){
        set_input(input.slice(0,-1))
      }
      else if(evt.key==="Delete") {
        set_input("")
      }
    }
    
  }

  return (
    <div style={css.container}>
      <div className="d-flex justify-content-center pt-2">
        <div className="p-1 input-group" style={css.divinput}>
          <input type="password" className="form-control" style={css.input}

            autoFocus
            ref={refinput}
            value={input}
            onChange={on_change}
            onKeyUp={on_keyup}
          />
        </div>
        <div className="p-1">
          <button className="btn btn-warning" type="button" style={css.btndel}
            onClick={on_clear}
          >&lt;</button>
        </div>
      </div>
      
      <div className="d-flex justify-content-center">
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
      
      <div className="d-flex justify-content-center">
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

      <div className="d-flex justify-content-center">
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

      <div className="d-flex justify-content-center">
        <div className="p-1">
          <button className="btn btn-danger" type="button" style={css.btn}
            onClick={on_nok}
          >X</button>
        </div>
        <div className="p-1">
          <button className="btn btn-primary" type="button" style={css.btn}
            onClick={() => on_click(0)}
          >0</button>
        </div>
        <div className="p-1">
          <button className="btn btn-success" type="button" style={css.btn}
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
    width: "475px",
    height: "465px",
    //border: "1px solid red"
    backgroundColor: "#aaa",
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
    backgroundColor: "white"
  },  

  btndel : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "150px",
    height: "60px",
    fontSize: "32px",
    fontWeight: "bold",
  }    
}

export default KbNumbers;
