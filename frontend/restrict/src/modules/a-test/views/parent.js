import React from "react"
import ModalRaw from "components/raw/modal/modalraw"
import useModalraw from "components/raw/modal/usemodalraw"
import "components/raw/modal/modalraw.css"
import Toastraw from "components/raw/toast/toastraw"
import useToastraw from "components/raw/toast/usetoastraw"
import "components/raw/toast/toastraw.css"
import checkIcon from "components/raw/toast/svg/check.svg"
import errorIcon from "components/raw/toast/svg/error.svg"
import infoIcon from "components/raw/toast/svg/info.svg"
import warningIcon from "components/raw/toast/svg/warning.svg"


function Parent() {

	const [is_opened_lm, open_modal_lm, close_modal_lm] = useModalraw()
	const [is_opened_cm, open_modal_cm, close_modal_cm] = useModalraw()
	const [is_opened_toast, open_toast, close_toast] = useToastraw()


	const testList = [
		{
			id: 1,
			title: "Success",
			description: "This is a success toast component",
			backgroundColor: "#5cb85c",
			icon: checkIcon
		},
		{
			id: 2,
			title: "Danger",
			description: "This is an error toast component",
			backgroundColor: "#d9534f",
			icon: errorIcon
		},
	];

  return (
    <div className="container">
      <br/>
      <h1>Test Index</h1>
			<button onClick={open_modal_lm}>open login modal</button>
			<button onClick={open_modal_cm}>open chat modal</button>

			<Toastraw
				toastList={testList}
				position="top-right"
			/>

			<ModalRaw
				title={"login"}
				is_open={is_opened_lm}
				fn_close={close_modal_lm}
			>
				<form>
					<input type="email" placeholder="correo"/>
					<input type="password" placeholder="contraseña"/>
				</form>
			</ModalRaw>

			<ModalRaw
				title={"chat"}
				is_open={is_opened_cm}
				fn_close={close_modal_cm}
			>
				<p>Hola!! <b>Eaf</b></p>
				<p>Que hace :v <b>Maria</b></p>
			</ModalRaw>
    </div>
  )

}

//export default memo(Parent);
export default Parent
