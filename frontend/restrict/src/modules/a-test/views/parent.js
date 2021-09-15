import React, {useState} from "react"
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

let toastProperties = null

function Parent() {

	const [list, setList] = useState([]);
	const [is_opened_lm, open_modal_lm, close_modal_lm] = useModalraw()
	const [is_opened_cm, open_modal_cm, close_modal_cm] = useModalraw()
	const [is_opened_toast, open_toast, close_toast] = useToastraw()


	const showToast = type => {
		const id = Math.floor((Math.random() * 101) + 1);

		switch(type) {
			case "success":
				toastProperties = {
					id,
					title: "Success",
					description: "This is a success toast component",
					backgroundColor: "#5cb85c",
					icon: checkIcon
				}
				break;
			case "danger":
				toastProperties = {
					id,
					title: "Danger",
					description: "This is a error toast component",
					backgroundColor: "#d9534f",
					icon: errorIcon
				}
				break;
			case "info":
				toastProperties = {
					id,
					title: "Info",
					description: "This is an info toast component",
					backgroundColor: "#5bc0de",
					icon: infoIcon
				}
				break;
			case "warning":
				toastProperties = {
					id,
					title: "Warning",
					description: "This is a warning toast component",
					backgroundColor: "#f0ad4e",
					icon: warningIcon
				}
				break;

			default:
				setList([]);
		}

		setList([...list, toastProperties]);
	}

  return (
    <div className="container">
      <br/>
      <h1>Test Index</h1>
			<button onClick={open_modal_lm}>open login modal</button>
			<button onClick={open_modal_cm}>open chat modal</button>
			<button onClick={() => showToast("success")}>open toast</button>

			<Toastraw
				toastList={list}
				position={"top-right"}
				autoDelete={false}
				autoDeleteTime={0}
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
