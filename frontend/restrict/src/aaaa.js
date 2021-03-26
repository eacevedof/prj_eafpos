import React, {useContext} from 'react';
import {GlobalContext} from '../context/global_context';

function Aaaa() {
  const {products} = useContext(GlobalContext)
  return (
     <>Aaaa</>
  )
}

export default Aaaa;
