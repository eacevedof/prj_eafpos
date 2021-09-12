import React, {useState} from "react"
import ModalRaw from "components/bootstrap/modal/modalraw"
import "components/bootstrap/modal/modalraw.css"

function Parent() {

	const [is_opened, set_isopened] = useState(false)

	const open_modal = () => {
		set_isopened(true)
	}

	const close_modal = () => {
		set_isopened(false)
	}

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
