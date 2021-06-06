import React from "react"
import { useIdleTimer } from "react-idle-timer"
import { useHistory } from "react-router"

const SESSION_IDEL_MINUTES = 4;

const Session = ({component}) => {
  const history = useHistory()

  const handleOnIdle = event => {
    // SHOW YOUR MODAL HERE AND LAGOUT
    //console.log("user is idle", event)
    console.log("last active", getLastActiveTime())
    history.push("/")
  }

  const {getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * SESSION_IDEL_MINUTES,
    onIdle: handleOnIdle,
    debounce: 500,
  })

  return component
}

export default Session