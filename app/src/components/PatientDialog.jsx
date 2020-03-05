import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

const PatientDialog = props => {
  const { open, onClose, handleSubmit } = props

  const [formData, setFormData] = useState({})

  const setFormField = (data, field) => {
    setFormData({ ...formData, [field]: data })
  }

  const renderTextField = (fieldId, label, required, type) => {
    return (
      <TextField
        style={{ margin: '10px' }}
        onChange={e => setFormField(e.target.value, fieldId)}
        label={label}
        variant='outlined'
        required={required}
        type={type ? type : 'string'}
      />
    )
  }

  const renderCheckbox = (fieldId, label) => {
    return (
      <FormControlLabel
        control={
          <Checkbox onChange={e => setFormField(e.target.checked, fieldId)} />
        }
        label={label}
      />
    )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div
        style={{
          padding: '20px',
          margin: '20px'
        }}>
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit(formData)
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
            {renderCheckbox('uti', 'UTI?')}
            {renderCheckbox('reflux', 'Reflux?')}
            {renderTextField('function_type', 'Function Type', true)}
            <Button
              style={{ margin: '20px' }}
              type='submit'
              color='default'
              variant='contained'>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default PatientDialog
