//App.js
import React from 'react';
import GlobalProvider from 'components/context/global_context';
import Boot from 'components/boot/boot';
import Devstripe from "components/boot/devstripe"

function App(){
  return (
    <GlobalProvider>
      <Devstripe />
      <Boot/>
    </GlobalProvider>
  );
}//App

export default App;