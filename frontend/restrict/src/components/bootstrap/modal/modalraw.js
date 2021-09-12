import React from "react"

//https://www.youtube.com/watch?v=nE8UiSM44SY
const Modalraw = ({is_open, fn_close}) => {
	return (
		<div className={`modal-raw ${is_open && "modal-raw-open"}`}>
			<div className="modal-raw-dialog">
				<h1>Modal</h1>
				<button onClick={fn_close}>x</button>
			</div>
		</div>
	)
}

export default Modalraw