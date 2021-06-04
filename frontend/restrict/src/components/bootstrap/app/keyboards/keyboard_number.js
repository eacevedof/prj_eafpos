import React, { useState, useRef } from "react"
import "./keyboard_number.css"

function KeyboardNumber({onaccept, oncancel}) {

  const maxlength = 10
  const validkeys = [
      "Backspace","Delete","Shift","ArrowLeft","ArrowRight","ArrowTop","ArrowDown","Meta","Enter","Escape",
      "0","1","2","3","4","5","6","7","8","9",
      ",","."
  ]

  const in_array = (ar, value) => ar.filter( v => v===value).length>0
  const in_string = (str, chars) => chars.filter(char => str.includes(char)).length>0
  const is_copy_paste = e => {
    const COPY = 67
    const PASTE = 86

    const key = parseInt(e.which || e.keyCode)
    const ctrl = e.ctrlKey || e.metaKey
    console.log("ctrl",ctrl,"key",key)
    return ((key === PASTE && ctrl) || (key === COPY && ctrl))
  }

  const [input, set_input] = useState("")
  const refinput = useRef(null)

  const on_clear = () => {
    set_input(input.slice(0,-1))
    refinput.current.focus()
  }

  const on_cancel = () => {
    set_input("")
    oncancel()
  }

  const on_accept = () => {
    const notnum = parseFloat(input.replace(",","."))
    console.log(input,"is_number",notnum)
    if(isNaN(notnum)){
      refinput.current.focus()
      return
    }
    onaccept(notnum)
  }

  const on_click = n => {
    if(input.length<maxlength)
      set_input(input.concat(n))
    refinput.current.focus()
  }

  const on_change = evt => {
    console.log("on_change")
    if(input.length<maxlength)
      set_input(evt.target.value)
  }

  const on_keydown = evt => {
    console.log("on_keydown")
    const key = evt.key
    console.log("key",key, "evt.withc",evt.which,"evtkeycode",evt.keyCode)
    if (is_copy_paste(evt)) return

    if(
        (!in_array(validkeys, key)) ||
        (in_array([".",","], key) && in_string(input, [".",","]))
    )
      evt.preventDefault()
  }

  function triggerEvent(el, type, keyCode) {
    if ('createEvent' in document) {
      // modern browsers, IE9+
      const e = document.createEvent('HTMLEvents');
      e.keyCode = keyCode;
      console.log("el",el,"type",type,"keycode",keyCode)
      e.initEvent(type, false, true);
      el.dispatchEvent(e);
    } else {
      // IE 8
      const e = document.createEventObject();
      e.keyCode = keyCode;
      e.eventType = type;
      el.fireEvent('on'+e.eventType, e);
    }
  }
  const test_p = (e) => {
    const el = e.target
    const ev3 = document.createEvent("KeyboardEvent")
    ev3.initEvent(
        "keypress", true, true, window, false, false, false, false, 13, 0)
    el.dispatchEvent(ev3)
  }

  const on_keyup = evt => {
    console.log("on_keyup")
    const key = evt.key
    if(key==="Escape") return on_cancel()
    if(key==="Enter") return on_accept()
    if(key==="Backspace") set_input(input.slice(0,-1))
    if(key==="Delete") set_input("")
  }

  const on_keypress = evt => {
    console.log("on_keypress")
  }

  return (
    <div className="keyboard-number-grid">
      <div className="input-group cell-span-2">
        <input type="text" className="form-control kb-input"
               autoFocus
               ref={refinput}
               value={input}
               onKeyPress={on_keypress}
               onChange={on_change}
               onKeyDown={on_keydown}
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
                onClick={test_p}
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
      <div>
        <button className="btn btn-danger kb-btn" type="button"
                onClick={on_cancel}
        >X</button>
      </div>
      <div>
        <button className="btn btn-primary kb-btn" type="button"
                onClick={() => on_click(0)}
        >0</button>
      </div>
      <div>
        <button className="btn btn-success kb-btn" type="button"
                onClick={on_accept}
        >OK</button>
      </div>
    </div>
  )
}

export default KeyboardNumber;
