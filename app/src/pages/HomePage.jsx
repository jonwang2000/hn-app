import React, { useState, useEffect } from 'react'

import { Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import app from 'DMF/feathers-client.js'
import useResponsive from 'DMF/hooks/useResponsive'

const HomePage = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const { onMobile } = props

  const handleLogOut = () => {
    app.logout().then(() => setIsAuthenticated(false))
  }

  useEffect(() => {
    app.authentication.getAccessToken().then(accessToken => {
      accessToken
        ? app.reAuthenticate().then(() => setIsAuthenticated(true))
        : setIsAuthenticated(false)
    })
  }, [])

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
            : { width: 500 })
        }}>
        <Typography variant='h3' style={{ margin: '20px' }}>HOME PAGE</Typography>
        <Typography variant='body1' style={{ margin: '10px' }}>
          Testing testing 123
        </Typography>
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

export default useResponsive()(HomePage)
