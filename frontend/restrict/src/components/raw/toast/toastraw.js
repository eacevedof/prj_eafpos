import React, {useState, useEffect} from "react"
import "components/raw/toast/toastraw.css"
import PropTypes from "prop-types"

//fuente:
//https://www.w3schools.com/howto/howto_js_snackbar.asp
//https://blog.logrocket.com/how-to-create-a-custom-toast-component-with-react/
const Toastraw = props => {
	const { toastList, position, autoDelete, dismissTime } = props;
	const [list, setList] = useState(toastList);

	useEffect(() => {
		setList([...toastList]);
	}, [toastList]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (autoDelete && toastList.length && list.length) {
				deleteToast(toastList[0].id);
			}
		}, dismissTime);

		return () => {
			clearInterval(interval);
		}

		// eslint-disable-next-line
	}, [toastList, autoDelete, dismissTime, list]);

	const deleteToast = id => {
		const listItemIndex = list.findIndex(e => e.id === id);
		const toastListItem = toastList.findIndex(e => e.id === id);
		list.splice(listItemIndex, 1);
		toastList.splice(toastListItem, 1);
		setList([...list]);
	}

	return (
		<>
			<div className={`notification-container ${position} debug`}>
				{
					list.map((toast, i) =>
						<div
							key={i}
							className={`notification toast ${position}`}
							style={{ backgroundColor: toast.backgroundColor }}
						>
							<button onClick={() => deleteToast(toast.id)}>
								X
							</button>
							<div className="notification-image">
								<img src={toast.icon} alt="" />
							</div>
							<div>
								<p className="notification-title">{toast.title}</p>
								<p className="notification-message">
									{toast.description}
								</p>
							</div>
						</div>
					)
				}
			</div>
		</>
	)
}

Toastraw.propTypes = {
	toastList: PropTypes.array.isRequired,
	position: PropTypes.string,
	autoDelete: PropTypes.bool,
	dismissTime: PropTypes.number
}

export default Toastraw