import React from 'react';

function Spinnergrow({type}) {
  if(!type) type="success"
  const classname = `spinner-grow text-${type}`

  const style = {
    width: "3rem",
    height: "3rem"
  }

  return (
    <div className="text-center">
      <div className={classname} style={style} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinnergrow;
