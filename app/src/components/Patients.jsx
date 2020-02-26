import React from 'react'

import PatientsDataTable from 'DMF/components/PatientsDataTable.jsx'

const Patients = props => {
  const { data, handleRowClick } = props

  return (
    <div>
      <PatientsDataTable data={data} handleRowClick={handleRowClick}/>
    </div>
  )
}

export default Patients
