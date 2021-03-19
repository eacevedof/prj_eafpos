import React from 'react';
import {APP_VERSION} from "config/constants"

function footer() {
  return (
    <footer className="footer mt-3">
      <div className="container-fluid">
        <nav>
          <p className="text-center">
            © {new Date().getFullYear()} 
            &nbsp;&nbsp;Admin pannel
            <small>&nbsp;&nbsp;v:{APP_VERSION}</small>
          </p>
        </nav>
      </div>
    </footer>    
  )
}

export default footer;


