import React, {memo} from "react"
import {APP_VERSION} from "config/constants"

const year = new Date().getFullYear()

function footer() {
  return (
    <footer className="footer mt-3">
      <div className="container-fluid">
        <nav>
          <p className="text-center">
            © {year}
            &nbsp;&nbsp;Admin pannel
            <small>&nbsp;&nbsp;v:{APP_VERSION}</small>
          </p>
        </nav>
      </div>
    </footer>    
  )
}

export default memo(footer)


