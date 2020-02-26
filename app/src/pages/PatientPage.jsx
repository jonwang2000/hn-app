import React, { useState, useEffect } from 'react'

import Paper from '@material-ui/core/Paper'

import { useParams, Redirect } from 'react-router-dom'

import app from 'DMF/feathers-client.js'

import useResponsive from 'DMF/hooks/useResponsive'
import Patient from 'DMF/components/Patient.jsx'

const PatientPage = props => {
  const { slug } = useParams()
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

  if (!isAuthenticated) {
    return <Redirect to='/login'/>
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
          <Patient patientId={slug}/>
        </Paper>
    </div>
  )
}

export default useResponsive()(PatientPage)
