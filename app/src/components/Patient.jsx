import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

import PatientDataTable from 'DMF/components/PatientDataTable.jsx'

import fakeData from 'DMF/constants/fakeData'

const Patient = props => {
  const { patientId } = props
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: Update to use API when API is up

  useEffect(() => {
    setData(fakeData.find(entry => entry.id === patientId))
    if (data) {
      setIsLoading(false)
    }
  }, [data, isLoading])

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div>
      PATIENT
      <h3>{data.studyId}</h3>
      <h2>visits: {data.numVisits}</h2>
      <h3>surgery: {data.probSurgery}%</h3>

      <PatientDataTable />

      <Link to='/' style={{ textDecoration: 'none' }}>
        <Button
          onClick={() => window.history.go(-1)}
          color='primary'
          variant='contained'
          style={{ width: '100%' }}>
          Back
        </Button>
      </Link>
    </div>
  )
}

export default Patient
