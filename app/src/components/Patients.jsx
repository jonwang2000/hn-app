import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import app from 'DMF/feathers-client.js'

import DataTable from 'DMF/components/DataTable.jsx'
import PatientsDialog from 'DMF/components/PatientsDialog.jsx'

import { useEffect } from 'react'

const patientColumns = [
  { name: 'study_id', label: 'Study Id' },
  { name: 'sex', label: 'Sex' }
]

const Patients = props => {
  const { handleLogOut } = props

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)

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
    <div
      style={{
        margin: 'auto',
        padding: '20px'
      }}>
      {renderDialog()}
      <Typography
        variant='h4'
        style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Patients
      </Typography>

      <Typography variant='body1' style={{ margin: '10px' }}>
        Below is a list of all the patients and their probability of surgery
        calculated based on their most recent visit. To re-calculate
        probabilities across all patients click the run button below.
      </Typography>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          margin: '20px 0px'
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

      <div>
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
      </div>

      <Button
        variant='contained'
        color='default'
        style={{ width: '100%', marginTop: '30px' }}
        onClick={handleLogOut}>
        Log Out
      </Button>
    </div>
  )
}

export default Patients
