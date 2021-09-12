import React from "react"

//fuente:
//https://www.youtube.com/watch?v=nE8UiSM44SY
//https://medium.com/@josephat94/a-simple-but-awesome-animation-with-css3-for-your-modals-eb24ebe4ab99
const Modalraw = ({title, is_open, fn_close, children}) => {

	const on_dialogclick = (evt) => {
		//como dialog es el div mas interno si se hace click en este tambien se haría en el div background
		//y se terminaria cerrando. Por esto se detiene la propagacion
		evt.stopPropagation()
	}

	return (
		<div className={`modal-raw ${is_open ? "show-animation" : "hide-animation"}`} onClick={fn_close}>
			<div className="modal-raw-dialog" onClick={on_dialogclick}>
				{title && <h1>{title}</h1>}
				<button onClick={fn_close}>x</button>
				{children}
			</div>
		</div>
	)
}

export default Modalraw