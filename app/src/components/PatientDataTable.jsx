import React from 'react'

import MUIDataTable from 'mui-datatables'

const PatientDataTable = props => {
  const { data, handleRowClick } = props

  const columns = [
    {
      name: 'age',
      label: 'Age'
    },
    {
      name: 'imageNo',
      label: 'Num Images'
    },
    {
      name: 'uti',
      label: 'UTI'
    },
    {
      name: 'probSurgery',
      label: 'Prob. Surgery'
    }
  ]

  const options = {
    onRowClick: (rowData, rowMeta) => handleRowClick(data[rowMeta.rowIndex])
  }

  return <MUIDataTable title='Visits' data={data} columns={columns} options={options} />
}

export default PatientDataTable
