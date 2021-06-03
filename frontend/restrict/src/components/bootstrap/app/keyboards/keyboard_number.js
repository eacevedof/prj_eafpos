import React, { useState, useRef } from "react"
import "./keyboard_number.css"

function KeyboardNumber({onsubmit}) {

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

  const on_submit = () => {
    onsubmit(input)
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
    <div className="keyboard-number-grid">
      <div className="input-group cell-span-2 kb-divinput">
        <input type="text" className="form-control kb-input"

               autoFocus
               ref={refinput}
               value={input}
               onChange={on_change}
               onKeyUp={on_keyup}
        />
      </div>
      <div>
        <button className="btn btn-warning kb-btn-del" type="button"
                onClick={on_clear}
        >&lt;</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(7)}
        >7</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(8)}
        >8</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(9)}
        >9</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(4)}
        >4</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(5)}
        >5</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(6)}
        >6</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(3)}
        >3</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(2)}
        >2</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(1)}
        >1</button>
      </div>
    </div>
  )
}

export default KeyboardNumber;
