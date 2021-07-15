import React, {useContext, memo} from "react"

import {TableContext} from "components/bootstrap/tableaction/tablecontext"
import DropdownTable from "components/bootstrap/dropdown/dropdowntable"
import TableHead from "components/bootstrap/tableaction/tablehead"
import TableBody from "components/bootstrap/tableaction/tablebody"

function TableAction({arhead, ardata, objconf, multiconf}) {

  const {multivalues} = useContext(TableContext)

  return (
    <>
      {
        multivalues.length > 0 && <DropdownTable multiconf={multiconf} fnconfirm={multiconf.fnmultiaction(multivalues)} />
      }
      <table className="table">
        <TableHead arhead={arhead} objconf={objconf} multiconf={multiconf} />
        <TableBody arhead={arhead} ardata={ardata} objconf={objconf} multiconf={multiconf} />
      </table>
    </>
  )
}

export default memo(TableAction)
