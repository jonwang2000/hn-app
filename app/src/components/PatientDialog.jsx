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
            {renderCheckbox('uti', 'UTI?')}
            {renderCheckbox('reflux', 'Reflux?')}
            {renderCheckbox('vcug', 'VCUG?')}
            {renderCheckbox('nuclear_scan', 'Nuclear Scan?')}
            {renderCheckbox('prophylaxis', 'Prophylaxis?')}
            {renderTextField('function_type', 'Function Type', true)}
            {renderTextField('function_test', 'Function Test', true, 'number')}
            {renderTextField(
              'ultrasound_date',
              'Ultrasound Date',
              true,
              'date'
            )}
            {renderTextField('age_at_visit', 'Age at Visit', true, 'number')}
            {renderCheckbox('surgery_indicated', 'Surgery Indicated?')}
            {renderTextField('surgery_type', 'Surgery Type', false)}

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
