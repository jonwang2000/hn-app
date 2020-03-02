import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import PatientsDataTable from 'DMF/components/PatientsDataTable.jsx'
import PatientsDialog from 'DMF/components/PatientsDialog.jsx'

const Patients = props => {
  const { data, handleRowClick, handleLogOut } = props
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState(null)

  const handleSubmit = newData => {
    console.log(newData)
    setFormData(newData)
    setShowDialog(false)
  }

  const renderDialog = () => {
    return (
      <PatientsDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        handleSubmit={handleSubmit}
      />
    )
  }

  return (
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
        <PatientsDataTable data={data} handleRowClick={handleRowClick} />
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
