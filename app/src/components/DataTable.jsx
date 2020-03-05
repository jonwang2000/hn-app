import React from 'react'

import MUIDataTable from 'mui-datatables'

const PatientsDataTable = props => {
  const { data, handleRowClick, columns } = props

  const options = {
    onRowClick: (rowData, rowMeta) => handleRowClick(data[rowMeta.rowIndex])
  }

  return <MUIDataTable title='Patients' data={data} columns={columns} options={options} />
}

export default PatientsDataTable
