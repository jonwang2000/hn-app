import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

const PatientsDialog = props => {
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
        InputLabelProps={
          type === 'date'
            ? {
                shrink: true
              }
            : null
        }
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
            {renderTextField('study_id', 'Study ID', true)}
            {renderTextField('patient_age', 'Patient Age', true, 'number')}
            {renderTextField('sex', 'Sex', true)}
            {renderCheckbox('surgery_performed', 'Surgery Performed?')}
            {renderTextField('surgery_age', 'Surgery Age', false, 'number')}
            {renderTextField('ultrasound_date', 'Ultrasound Date', false, 'date')}
            {renderTextField('hn_side', 'HN Side', false)}
            {renderCheckbox('prophylaxis', 'Prophylaxis?')}
            {renderTextField('etiology', 'Known Anomalies', true)}
            {renderTextField('ethnicity', 'Ethicity', true)}
            {renderTextField('postal_code', 'Postal Code', true)}
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

export default PatientsDialog
