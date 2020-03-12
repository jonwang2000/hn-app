import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import app from 'HNA/feathers-client.js'

import DataTable from 'HNA/components/DataTable.jsx'
import PatientsDialog from 'HNA/components/PatientsDialog.jsx'

const patientColumns = [
  { name: 'study_id', label: 'Study Id' },
  { name: 'sex', label: 'Sex' }
]

const Patients = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)

  // Functions
  const fetchData = () => {
    setIsLoading(true)
    app
      .service('patients')
      .find()
      .then(res => {
        setData(res.data)
      })
      .then(() => setIsLoading(false))
  }

  // componentDidMount
  useEffect(() => {
    fetchData()
  }, [])

  // Handling formData change (create new Patient)
  useEffect(() => {
    if (formData) {
      app
        .service('patients')
        .create(formData)
        .then(e => console.log(e))
        .then(() => fetchData())
        .catch(e => console.log(e))
    }
  }, [formData])

  // Handlers
  const handleRowClick = patient => {
    props.history.push(`/patient/${patient.study_id}`)
  }

  const handleSubmit = newData => {
    setFormData(newData)
    setShowDialog(false)
  }

  // Rendering
  const renderDialog = () => {
    return (
      <PatientsDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        handleSubmit={handleSubmit}
      />
    )
  }

  const renderSummary = () => {
    return (
      <Grid item xs={12} style={{ width: '100%' }}>
        <Card>
          <Typography
            variant='h3'
            style={{ fontWeight: 'bold', padding: '20px 20px 0 20px' }}>
            Patients
          </Typography>

          <Typography
            variant='body1'
            style={{ padding: '10px 20px 20px 20px' }}>
            Below is a list of all the patients and their probability of surgery
            calculated based on their most recent visit. To re-calculate
            probabilities across all patients click the run button below.
          </Typography>
        </Card>
      </Grid>
    )
  }

  const renderTable = () => (
    <Grid item xs={12} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          padding: '20px'
        }}>
        <Button
          size='small'
          variant='contained'
          color='default'
          onClick={() => setShowDialog(true)}
          style={{ marginLeft: '20px' }}>
          New Patient
        </Button>

        <Button size='small' variant='contained' color='default' disabled>
          Run
        </Button>
      </div>
      <DataTable
        data={data}
        handleRowClick={handleRowClick}
        columns={patientColumns}
        title={
          isLoading && (
            <CircularProgress
              size={24}
              style={{ marginLeft: 15, position: 'relative', top: 4 }}
            />
          )
        }
      />
    </Grid>
  )

  return isLoading ? (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
      <CircularProgress />
    </div>
  ) : (
    <Grid
      container
      spacing={4}
      justify='center'
      alignItems='center'
      style={{
        marginTop: '20px',
        padding: '20px'
      }}>
      {renderDialog()}
      {renderSummary()}
      {renderTable()}
    </Grid>
  )
}

export default Patients
