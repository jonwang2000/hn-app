import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
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
    <div>
      {renderDialog()}
      <Typography variant='h3' style={{ margin: '20px' }}>
        HOME PAGE
      </Typography>

      <Button
        size='small'
        variant='contained'
        color='default'
        onClick={() => setShowDialog(true)}
      >
        Dialog
      </Button>

      <PatientsDataTable data={data} handleRowClick={handleRowClick} />

      <Button
        variant='contained'
        color='default'
        style={{ width: '100%' }}
        onClick={handleLogOut}
      >
        Log Out
      </Button>
    </div>
  )
}

export default Patients
