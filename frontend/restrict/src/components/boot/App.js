//App.js
import React from "react";
import GlobalProvider from "components/context/global_context"
import Boot from "components/boot/boot"
import Devstripe from "components/boot/devstripe"
import ToastMini from "components/bootstrap/toast/toastmini"

function App(){
  return (
    <GlobalProvider>
      <Devstripe />
      <Boot/>
      <ToastMini type={"success"} />
      <ToastMini type={"warning"} />
      <ToastMini type={"danger"} />
    </GlobalProvider>
  );
}//App

export default App;