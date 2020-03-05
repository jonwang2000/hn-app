import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { Link } from 'react-router-dom'

import app from 'DMF/feathers-client.js'

import DataTable from 'DMF/components/DataTable.jsx'
import PatientDialog from 'DMF/components/PatientDialog.jsx'

const visitsColumns = [
  { name: 'id', label: 'Visit Id' },
  { name: 'created_at', label: 'Date' }
]

const Patient = props => {
  const { studyId } = props

  const [patientData, setPatientData] = useState(null)
  const [visitsData, setVisitsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)
  const [badId, setBadId] = useState(false)

  const fetchPatientData = () => {
    app
      .service('patients')
      .find({
        query: {
          study_id: studyId
        }
      })
      .then(res => {
        if (typeof res.data[0] === 'undefined') {
          setBadId(true)
        } else {
          setPatientData(res.data[0])
        }
        setIsLoading(false)
      })
  }

  const fetchVisitsData = () => {
    app
      .service('visits')
      .find({ query: { patient_id: patientData.id } })
      .then(res => {
        setVisitsData(res.data)
      })
  }

  // Fires on component load
  useEffect(() => {
    fetchPatientData()
  }, [])

  // Fires after patientData is loaded
  useEffect(() => {
    if (patientData) {
      fetchVisitsData()
    }
  }, [patientData])

  // Handling formData change (create new Patient)
  // TODO: clean this up
  useEffect(() => {
    if (formData) {
      app
        .service('users')
        .find()
        .then(res => {
          const data = {
            ...formData,
            patient_id: patientData.id,
            provider: res.data[0].id
          }
          app
            .service('visits')
            .create(data)
            .then(e => console.log(e))
            .then(() => fetchVisitsData())
            .catch(e => console.log(e))
        })
    }
  }, [formData])

  const handleSubmit = newData => {
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
    return Object.keys(patientData).map(key => (
      <div key={key}>
        <Typography variant='body1'>
          <span style={{ fontWeight: 'bold' }}>{key}:</span>
          <span>{patientData[key]}</span>
        </Typography>
      </div>
    ))
  }

  // Return DOM elements
  if (isLoading) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        <CircularProgress />
      </div>
    )
  } else if (badId) {
    return <div>BAD ID</div>
  } else
    return (
      <div
        style={{
          margin: 'auto',
          padding: '20px'
        }}>
        {renderDialog()}

        <Typography variant='h4' style={{ textAlign: 'center' }}>
          Patient: {studyId}
        </Typography>

        <Typography variant='body1' style={{ margin: '10px 0px' }}>
          Below is a list of all the visits for this patient. To add a new visit
          click the add visit button. To view the images associated with a
          visit, click on the row to expand and preview.
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

        <DataTable
          data={visitsData}
          columns={visitsColumns}
          handleRowClick={() => console.log('visit')}
        />

        <Link to='/' style={{ textDecoration: 'none' }}>
          <Button
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
