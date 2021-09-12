import React from "react"
import useModal from "modules/a-test/views/useModal"
import ModalRaw from "components/bootstrap/modal/modalraw"
import "components/bootstrap/modal/modalraw.css"

function Parent() {

	const [is_opened, open_modal, close_modal] = useModal()

  return (
    <div className="container">
      <br/>
      <h1>Test Index</h1>
			<button onClick={open_modal}>open modal</button>
			<ModalRaw is_open={is_opened} fn_close={close_modal}/>
    </div>
  )
}

//export default memo(Parent);
export default Parent
