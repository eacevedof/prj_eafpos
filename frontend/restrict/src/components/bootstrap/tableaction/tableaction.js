import React, {useContext, useEffect} from 'react';

import {TableContext} from "components/bootstrap/tableaction/tablecontext"
import DropdownTable from "components/bootstrap/dropdown/dropdowntable"
import TableHead from "components/bootstrap/tableaction/tablehead"
import TableBody from "components/bootstrap/tableaction/tablebody"

import { pr } from 'helpers/functions';

function TableAction({arhead, ardata, objconf, multiconf}) {

  const {multivalues, set_multiaction} = useContext(TableContext)

  useEffect(()=>{
    console.log("tableaction.mounting")
    return ()=> console.log("tableaction.unmounting")
  },[multivalues])

  return (
    <>
      {
        multivalues.length > 0 ? <DropdownTable multiconf={multiconf} fnconfirm={multiconf.fnmultiaction(multivalues)} /> : null
      }
      
      <table className="table">
        <TableHead arhead={arhead} objconf={objconf} multiconf={multiconf} />
        <TableBody arhead={arhead} ardata={ardata} objconf={objconf} multiconf={multiconf} />
      </table>
    </>
  )
}

export default TableAction;
