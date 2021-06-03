import React, { useState, useRef } from "react"
import "keyboard_number.css"

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
      <div>txt</div><div>2</div><div>3</div>
      <div>4</div><div>5</div><div>6</div>
      <div>7</div><div>8</div><div>9</div>
    </div>
  )
}

export default KeyboardNumber;
