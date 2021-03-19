import React, {useContext} from 'react';
import {GlobalContext} from "../context/global_context"

function LoadingWheel() {

  const {is_loading} = useContext(GlobalContext)

  return (
    <>
      {
        is_loading ? (
        <div className="vertical-center">
          <img src="/assets/img/loading.gif" alt="loading.gif" />
        </div>) : null
      }
    </>
  )
}

export default LoadingWheel;
