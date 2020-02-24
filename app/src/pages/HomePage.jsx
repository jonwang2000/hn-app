import React, { useState, useEffect, useDebugValue } from 'react'

import { Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import app from 'DMF/feathers-client.js'

const HomePage = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const handleLogOut = () => {
    app.logout()
      .then(() => setIsAuthenticated(false))
  }

  useEffect(() => {
    app.authentication
      .getAccessToken()
      .then(accessToken => {
        accessToken ? app.reAuthenticate().then(() => setIsAuthenticated(true)) : setIsAuthenticated(false)
      })
  }, [])

  if (!isAuthenticated) {
    return <Redirect to='/login' />
  }

  return (
    <div>
      <h1>Home Page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
      <h2>{isAuthenticated ? 'Authed' : 'Not Authed'}</h2>
    </div>
  )
}

export default HomePage
