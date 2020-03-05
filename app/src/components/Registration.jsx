import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'DMF/feathers-client.js'
import useResponsive from 'DMF/hooks/useResponsive'

const Registration = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState(null)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(null)

  const handleCloseSnackBar = () => setSnackBarOpen(false)

  const handleRegisterUser = event => {
    event.preventDefault()
    const { authenticate } = props

    if (password !== passwordConfirmation) {
      return setError('Please make sure your passwords match')
    }

    app
      .service('users')
      .create({ email, password })
      .then(() => authenticate({ strategy: 'local', email, password }))
      .catch(err => {
        setSnackBarOpen(true)
        console.log(err)
        setSnackBarMessage('Sorry, this email has already been used')
      })
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <form onSubmit={handleRegisterUser}>
        <TextField
          error={error === 'email'}
          fullWidth
          required
          id='email'
          label='Email'
          margin='normal'
          onChange={event => setEmail(event.target.value)}
          type='email'
          autoComplete='email'
          variant='outlined'
          value={email}
        />
        <TextField
          fullWidth
          required
          id='password'
          label='Password'
          margin='normal'
          onChange={event => setPassword(event.target.value)}
          type='password'
          autoComplete='new-password'
          variant='outlined'
          value={password}
        />
        <TextField
          error={!!error}
          fullWidth
          helperText={error}
          required
          id='password-confirmation'
          label='Confirm Password'
          margin='normal'
          onChange={event => setPasswordConfirmation(event.target.value)}
          type='password'
          autoComplete='new-password'
          variant='outlined'
          value={passwordConfirmation}
        />
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
          <Button
            variant='contained'
            color='secondary'
            type='submit'
            style={{ width: '100%' }}>
            Sign Up
          </Button>
        </div>
        <Button
          onClick={() => window.history.go(-1)}
          color='primary'
          variant='contained'
          style={{ width: '100%' }}>
          Back
        </Button>
      </form>
    </div>
  )
}

export default useResponsive()(Registration)
