//App.js
import React from "react"
import GlobalProvider from "components/context/global_context"
import Boot from "components/boot/boot"
import Devstripe from "components/boot/devstripe"
import ToastMiniSuccess from "components/bootstrap/toast/toastminisuccess"
import ToastMiniWarning from "components/bootstrap/toast/toastminiwarning"
import ToastMiniError from "components/bootstrap/toast/toastminierror"

function App(){
  return (
    <GlobalProvider>
      <Devstripe />
      <Boot/>
      <ToastMiniSuccess />
      <ToastMiniWarning />
      <ToastMiniError />
    </GlobalProvider>
  );
}//App

export default App;