import React from "react"
import useModal from "modules/a-test/views/useModal"
import ModalRaw from "components/bootstrap/modal/modalraw"
import "components/bootstrap/modal/modalraw.css"

function Parent() {

	const [is_opened_lm, open_modal_lm, close_modal_lm] = useModal()
	const [is_opened_cm, open_modal_cm, close_modal_cm] = useModal()

  return (
    <div className="container">
      <br/>
      <h1>Test Index</h1>
			<button onClick={open_modal_lm}>open login modal</button>
			<button onClick={open_modal_cm}>open chat modal</button>

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
