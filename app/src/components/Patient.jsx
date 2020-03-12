import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import app from 'HNA/feathers-client.js'

import DataTable from 'HNA/components/DataTable.jsx'
import PatientDialog from 'HNA/components/PatientDialog.jsx'
import Visit from 'HNA/components/Visit.jsx'

const visitsColumns = [
  { name: 'id', label: 'Visit Id' },
  { name: 'created_at', label: 'Date' }
]

const Patient = props => {
  const { studyId } = props

  const [badId, setBadId] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [patientData, setPatientData] = useState(null)

  const [selectedVisit, setSelectedVisit] = useState({})
  const [visitsData, setVisitsData] = useState([])

  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)

  // Data functions
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

  // Handlers
  const handleSubmit = newData => {
    setFormData(newData)
    setShowDialog(false)
  }

  // Rendering
  const renderDialog = () => (
    <PatientDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      handleSubmit={handleSubmit}
    />
  )

  const renderPatientSummary = () => (
    <Grid item xs={12} sm={6} style={{ width: '100%' }}>
      <Card style={{ height: '100%' }}>
        <Typography
          variant='h3'
          style={{ fontWeight: 'bold', padding: '20px 20px 0 20px' }}>
          Patient: {studyId}
        </Typography>

        <Typography variant='body1' style={{ padding: '20px' }}>
          Below is a list of all the visits for this patient. To add a new visit
          click the add visit button. To view the images associated with a
          visit, click on the row to expand and preview.
        </Typography>
      </Card>
    </Grid>
  )

  const renderPatientInfo = () => (
    <Grid item xs={12} sm={6} style={{ width: '100%' }}>
      <Card style={{ height: '100%' }}>
        <div style={{ padding: '20px' }}>
          {Object.keys(patientData).map(key =>
            key !== 'id' ? (
              <div key={key}>
                <Typography variant='body1'>
                  <span style={{ fontWeight: 'bold' }}>{key}: </span>
                  <span>{patientData[key]}</span>
                </Typography>
              </div>
            ) : null
          )}
        </div>
      </Card>
    </Grid>
  )

  const renderVisitsTable = () => (
    <Grid item xs={12}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          marginBottom: '20px'
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
        handleRowClick={visit => setSelectedVisit(visit)}
      />
    </Grid>
  )

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
      <Grid
        container
        spacing={4}
        justify='center'
        style={{
          marginTop: '20px',
          padding: '20px'
        }}>
        {renderDialog()}
        {renderPatientSummary()}
        {renderPatientInfo()}
        {renderVisitsTable()}
        {selectedVisit.id ? <Visit id={selectedVisit.id} /> : null}
      </Grid>
    )
}

export default Patient
