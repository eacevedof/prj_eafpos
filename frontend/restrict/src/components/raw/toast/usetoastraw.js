import {useState} from "react"

const useToastraw = (iniValue=false) => {
	const [is_opened, set_isopened] = useState(iniValue)

	const open_toast = () => {
		set_isopened(true)
	}

	const close_toast = () => {
		set_isopened(false)
	}

	return [
		is_opened, open_toast, close_toast
	]
}

export default useToastraw