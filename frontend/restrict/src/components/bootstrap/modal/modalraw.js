import React from "react"

//https://www.youtube.com/watch?v=nE8UiSM44SY
const Modalraw = ({is_open, fn_close}) => {

	const on_dialogclick = (evt) => {
		//como dialog es el div mas interno si se hace click en este tambien se haría en el div background
		//y se terminaria cerrando. Por esto se detiene la propagacion
		evt.stopPropagation()
	}

	return (
		<div className={`modal-raw ${is_open && "modal-raw-open"}`} onClick={fn_close}>
			<div className="modal-raw-dialog" onClick={on_dialogclick}>
				<h1>Modal</h1>
				<button onClick={fn_close}>x</button>
			</div>
		</div>
	)
}

export default Modalraw