import React from "react"

//fuente:
//https://www.w3schools.com/howto/howto_js_snackbar.asp
const Toastraw = ({text, is_open, fn_close, children}) => {
	return (
			<div className={`toast-raw ${is_open ? "toast-raw-show" : "toast-raw-hide"}`}>
				<button className="toast-raw-btn-close toast-raw-btn-close-white" onClick={fn_close}></button>
				{<p>{text}</p>}
				{children}
			</div>
	)
}

export default Toastraw