import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'

const PatientsDialog = props => {
  const { open, onClose, handleSubmit } = props

  const [formData, setFormData] = useState({})

  const setFormField = (event, field) => {
    const data = event.target.value
    setFormData({ ...formData, [field]: data })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div
        style={{
          padding: '20px',
          margin: '20px'
        }}
      >
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit(formData)
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TextField
              style={{ margin: '20px' }}
              onChange={e => setFormField(e, 'field1')}
              variant='outlined'
            />
            <TextField
              style={{ margin: '20px' }}
              onChange={e => setFormField(e, 'field2')}
              variant='outlined'
            />
            <Button
              style={{ margin: '20px' }}
              type='submit'
              color='default'
              variant='contained'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default PatientsDialog
