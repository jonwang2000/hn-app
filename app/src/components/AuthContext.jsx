//  AuthContext.jsx

//  Maintains feathers jwt authentication state throughout application

import React, { createContext, useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

export const AuthContext = createContext()

export default ({ children }) => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')

  const authenticate = options => {
    return app
      .authenticate({ strategy: 'local', ...options })
      .then(() => setIsAuthed(true))
      .catch(err => {
        setIsAuthed(false)
        setSnackBar('Login failed, check email and/or password.')
      })
  }

  const setSnackBar = message => {
    setSnackBarMessage(message)
    setSnackBarOpen(true)
  }

  const setAuthState = authed => {
    setIsAuthed(authed)
    setIsAuthLoading(false)
  }

  const handleSnackBarClose = () => setSnackBarOpen(false)

  const logout = () => app.logout().then(() => setIsAuthed(false))

  const login = () =>
    app.authentication
      .getAccessToken()
      .then(accessToken => {
        if (accessToken) {
          app
            .reAuthenticate()
            .then(() => {
              setAuthState(true)
            })
            .catch(() => {
              setAuthState(false)
            })
        } else {
          setAuthState(false)
        }
      })
      .catch(() => {
        setAuthState(false)
      })

  useEffect(() => {
    login()
  }, [])

  useEffect(() => {}, [isAuthed])

  const defaultContext = {
    isAuthed,
    isAuthLoading,
    snackBarOpen,
    snackBarMessage,
    handleSnackBarClose,
    authenticate,
    logout
  }

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  )
}
