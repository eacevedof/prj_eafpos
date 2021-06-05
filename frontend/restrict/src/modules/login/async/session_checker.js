import {TIME_SESSION} from "config/constants"
import db from "helpers/localdb"
import dt from "helpers/datetime"

export const session_refresh = () => {
  db.save("last_action", dt.get_timestamp_secs())
}

const is_session_finished = () => {
  const lastaction = db.select("last_action")
  const now = dt.get_timestamp_secs()
  return dt.get_timestamp_diff(now, lastaction) > parseInt(TIME_SESSION)
}

export default is_session_finished