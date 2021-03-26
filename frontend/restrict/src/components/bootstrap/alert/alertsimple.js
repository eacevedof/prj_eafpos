import React from 'react';

//type: primary, secondary, success, danger, warning, info, light, dark
function AlertSimple({message, type}) {
  if(!type) type="success"

  const classname = `alert alert-${type}`

  return (
    <div className={classname} role="alert">
      {message}
    </div>
  )
}

export default AlertSimple;
