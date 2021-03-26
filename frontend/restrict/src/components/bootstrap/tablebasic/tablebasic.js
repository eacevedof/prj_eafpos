import React, {useContext, useEffect} from 'react';
import TableHead from "./tablehead"
import TableBody from "./tablebody"

function TableBasic({arhead, ardata}) {

  useEffect(()=>{
    return ()=> console.log("tablebasic unmounting")
  },[])

  return (
    <table className="table">
      <TableHead arhead={arhead}/>
      <TableBody arhead={arhead} ardata={ardata} />
    </table>
  )
}

export default TableBasic;
