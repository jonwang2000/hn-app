import React, { useState, useEffect } from 'react'

import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'

import app from 'DMF/feathers-client.js'

import useResponsive from 'DMF/hooks/useResponsive'
import Login from 'DMF/components/Login.jsx'
import Registration from 'DMF/components/Registration.jsx'

const LoginPage = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(null)

  const onMobile = props.onMobile

  // Replaces componentDidMount
  useEffect(() => {
    app.authentication.getAccessToken().then(accessToken => {
      accessToken
        ? app.reAuthenticate().then(() => setIsAuthenticated(true))
        : setIsAuthenticated(false)
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

  const renderForms = () => {
    return (
      <Router>
        <Switch>
          <Route path='/register'>
            <Registration authenticate={authenticate} />
          </Route>
          <Route path='/'>
            <Login authenticate={authenticate} />
            <div style={{ padding: '5px 20px' }}>
              <Link to='/register' style={{ textDecoration: 'none' }}>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ width: '100%' }}>
                  Register New User
                </Button>
              </Link>
            </div>
          </Route>
        </Switch>
      </Router>
    )
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
      }}>
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
        }}>
        <Typography align='center' variant='h3' style={{ padding: '20px' }}>
          HN App
        </Typography>
        {renderForms()}
      </Paper>
    </div>
  )
}

export default useResponsive()(LoginPage)
