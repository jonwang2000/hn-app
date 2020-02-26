import React from 'react'

import MUIDataTable from 'mui-datatables'

const PatientsDataTable = props => {
  const { data, handleRowClick } = props

  const columns = [
    {
      name: 'studyId',
      label: 'Study ID'
    },
    {
      name: 'numVisits',
      label: 'Visits'
    },
    {
      name: 'probSurgery',
      label: 'Surgery %'
    },
    {
      name: 'lastVisit',
      label: 'Last Visit'
    }
  ]

  const options = {
    onRowClick: (rowData, rowMeta) => handleRowClick(data[rowMeta.rowIndex])
  }

  return <MUIDataTable title='Patients' data={data} columns={columns} options={options} />
}

export default PatientsDataTable
