import React from "react"
import { useIdleTimer } from "react-idle-timer"
import { useHistory } from "react-router"
import {TIME_SESSION} from "config/constants"
import db from "helpers/localdb"
import {useLocation} from "react-router-dom"

const Session = ({component}) => {
  const history = useHistory()
  let location = useLocation()

  const on_idle = () => {
    db.delete("useruuid")
    db.delete("user_session")
    db.save("last_location", location.pathname)
    history.push("/")
  }

  const {getLastActiveTime } = useIdleTimer({
    timeout: 1000 * TIME_SESSION,
    onIdle: on_idle,
    debounce: 500,
  })

  return component
}

export default Session