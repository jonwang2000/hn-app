import React, { useState, useEffect } from 'react'

import { Route, Switch, Redirect, withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import app from 'DMF/feathers-client.js'
import useResponsive from 'DMF/hooks/useResponsive'

import Patients from 'DMF/components/Patients.jsx'

import fakeData from 'DMF/constants/fakeData'

const HomePage = props => {
  const { onMobile } = props

  // Managing auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    app.authentication.getAccessToken().then(accessToken => {
      accessToken
        ? app.reAuthenticate().then(() => setIsAuthenticated(true))
        : setIsAuthenticated(false)
    })
  }, [])

  // Handlers
  const handleLogOut = () => {
    app.logout().then(() => setIsAuthenticated(false))
  }

  // Return DOM elements
  if (!isAuthenticated) {
    return <Redirect to='/login' />
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
      <Paper
        elevation={onMobile ? 0 : 3}
        style={{
          padding: onMobile ? 10 : 20,
          position: 'relative',
          minHeight: 472,
          ...(onMobile
            ? { height: '100%', width: '100%', overflow: 'scroll' }
            : { width: 1000 })
        }}>
        <Typography variant='h3' style={{ margin: '20px' }}>
          HOME PAGE
        </Typography>

        <Patients
          data={fakeData}
          handleRowClick={patient =>
            props.history.push(`/patient/${patient.id}`)
          }
        />

        <Button
          variant='contained'
          color='default'
          style={{ width: '100%' }}
          onClick={handleLogOut}>
          Log Out
        </Button>
      </Paper>
    </div>
  )
}

export default useResponsive()(withRouter(HomePage))
