import React, { useState, useEffect } from 'react'

import { Redirect, withRouter } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'

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
  const handleRowClick = patient => props.history.push(`/patient/${patient.id}`)

  const handleLogOut = () => app.logout().then(() => setIsAuthenticated(false))

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
        <Patients
          data={fakeData}
          handleRowClick={handleRowClick}
          handleLogOut={handleLogOut}
        />
      </Paper>
    </div>
  )
}

export default useResponsive()(withRouter(HomePage))
