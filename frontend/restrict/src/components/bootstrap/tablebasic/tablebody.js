import React, {useEffect} from 'react';

function TableBody({arhead, ardata}) {

  useEffect(()=>{
    return ()=> console.log("tablebody unmounting")
  },[])

  const fieldshead = arhead.map(objh => objh.value)
  //console.log("fieldshead:",fieldshead)

  const get_tds = objrow => {
    return fieldshead
            //.filter(strfield => fieldshead.includes(strfield))
            .map( (strfield,i) => {
              return <td key={i}>{objrow[strfield]}</td>
            })
  }

  const get_trs = data => data.map( (objrow,i) => {
    //console.log("objrow",objrow)
    return (
      <tr key={i}>
        {get_tds(objrow)}
      </tr>
    ) //return
  })//get_trs

  return (
    <tbody>
      {get_trs(ardata)}
    </tbody>
  )
}

export default TableBody;
