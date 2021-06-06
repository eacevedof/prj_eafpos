import React from "react"
import { useIdleTimer } from "react-idle-timer"
import { useHistory } from "react-router"
import {TIME_SESSION} from "config/constants"
import db from "helpers/localdb"

const Session = ({component}) => {
  const history = useHistory()

  const on_idle = () => {
    db.delete("useruuid")
    db.delete("user_session")
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