import React, { useContext } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { Redirect, Route } from 'react-router-dom'

import { AuthContext } from 'HNA/components/AuthContext.jsx'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthed, isAuthLoading } = useContext(AuthContext)

  return isAuthLoading ? (
    <CircularProgress
      style={{ position: 'absolute', top: '50%', left: '50%' }}
    />
  ) : (
    <Route
      {...rest}
      render={props =>
        isAuthed === true ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

export default PrivateRoute
