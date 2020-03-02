import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { Link } from 'react-router-dom'

import PatientDataTable from 'DMF/components/PatientDataTable.jsx'
import PatientDialog from 'DMF/components/PatientDialog.jsx'

import fakeData from 'DMF/constants/fakeData'

const Patient = props => {
  const { patientId } = props

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)

  // TODO: Update to use API when API is up
  useEffect(() => {
    setData(fakeData.find(entry => entry.studyId === patientId))
    if (data) {
      setIsLoading(false)
    }
  }, [data, isLoading])

  const handleSubmit = newData => {
    console.log(newData)
    setFormData(newData)
    setShowDialog(false)
  }

  const renderDialog = () => {
    return (
      <PatientDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        handleSubmit={handleSubmit}
      />
    )
  }

  const renderPatientInfo = () => {
    return Object.keys(data).map(key => (
      <div key={key}>
        <Typography variant='body1'>
          <span style={{ fontWeight: 'bold' }}>{key}:</span> {data[key]}
        </Typography>
      </div>
    ))
  }

  // Return DOM elements
  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div
      style={{
        margin: 'auto',
        padding: '20px'
      }}>
      {renderDialog()}

      <Typography variant='h4' style={{ textAlign: 'center' }}>
        Patient: {patientId}
      </Typography>

      <Typography variant='body1' style={{ margin: '10px 0px' }}>
        Below is a list of all the visits for this patient. To add a new visit
        click the add visit button. To view the images associated with a visit,
        click on the row to expand and preview.
      </Typography>

      <div>
        <Typography variant='h6' style={{ fontWeight: 'bold' }}>
          Patient Information
        </Typography>
        {renderPatientInfo()}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          margin: '20px 0px'
        }}>
        <Button
          onClick={() => setShowDialog(true)}
          color='default'
          size='small'
          variant='contained'
          style={{ marginLeft: '20px' }}>
          Add Visit
        </Button>

        <Button size='small' variant='contained' color='default' disabled>
          Run
        </Button>
      </div>

      <PatientDataTable />

      <Link to='/' style={{ textDecoration: 'none' }}>
        <Button
          onClick={() => window.history.go(-1)}
          color='primary'
          variant='contained'
          style={{ width: '100%', marginTop: '20px' }}>
          Back
        </Button>
      </Link>
    </div>
  )
}

export default Patient
