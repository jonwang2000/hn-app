import React, { useState, useEffect } from 'react'

import { Redirect } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'

import app from 'DMF/feathers-client.js'

import useResponsive from 'DMF/hooks/useResponsive'
import Login from 'DMF/components/Login.jsx'

const LoginPage = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(null)

  const onMobile = props.onMobile

  // Replaces componentDidMount
  useEffect(() => {
    app.authentication
      .getAccessToken()
      .then(accessToken => {
        accessToken ? app.reAuthenticate().then(() => setIsAuthenticated(true)) : setIsAuthenticated(false)
      })
  }, [])

  const authenticate = options => {
    return app
      .authenticate({ strategy: 'local', ...options })
      .then(() => setIsAuthenticated(true))
      .catch(err => {
        setIsAuthenticated(false)
        setSnackBarOpen(true)
        setSnackBarMessage(
          'Login failed, please check your email and/or password'
        )
      })
  }

  const handleCloseSnackBar = () => setSnackBarOpen(false)

  if (isAuthenticated) {
    return <Redirect to='/' />
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <Paper
        elevation={onMobile ? 0 : 3}
        style={{
          padding: onMobile ? 10 : 20,
          position: 'relative',
          minHeight: 472,
          ...(onMobile
            ? { height: '100%', width: '100%', overflow: 'scroll' }
            : { width: 500 })
        }}
      >
        <div
          style={{
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            marginTop: onMobile ? 10 : 20,
            marginBottom: onMobile ? 10 : 40
          }}
        >
          HN App
        </div>
        {isAuthenticated ? <h1>Logged In</h1> : <h2>Not logged in</h2>}
        <Login authenticate={authenticate} />
      </Paper>
    </div>
  )
}

export default useResponsive()(LoginPage)
