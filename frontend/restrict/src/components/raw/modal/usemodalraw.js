import {useState} from "react"

const useModalraw = (iniValue=false) => {
	const [is_opened, set_isopened] = useState(iniValue)

	const open_modal = () => {
		set_isopened(true)
	}

	const close_modal = () => {
		set_isopened(false)
	}

	return [
		is_opened, open_modal, close_modal
	]
}

export default useModalraw