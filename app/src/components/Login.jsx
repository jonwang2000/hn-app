import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import useResponsive from 'DMF/hooks/useResponsive'

const Login = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { authenticate } = props

  useEffect(() => {
    const listener = e => {
      e.code === 'Enter' ? handleAuth() : null
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [email, password])

  const handleAuth = () => authenticate({ email, password })

  return (
    <div style={{ padding: '0 20px' }}>
      <form>
        <TextField
          fullWidth
          required
          id="email-local"
          label="Email"
          margin="normal"
          onChange={event => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          variant="outlined"
          value={email}
        />
        <TextField
          fullWidth
          required
          id="password-local"
          label="Password"
          margin="normal"
          onChange={event => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          variant="outlined"
          value={password}
        />
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAuth}
            style={{ width: '100%' }}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default useResponsive()(Login)
