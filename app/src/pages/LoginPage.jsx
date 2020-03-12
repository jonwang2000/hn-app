import React, { useContext } from 'react'

import { Redirect, Route, Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'

import useResponsive from 'HNA/hooks/useResponsive'
import Login from 'HNA/components/Login.jsx'
import Registration from 'HNA/components/Registration.jsx'
import { AuthContext } from 'HNA/components/AuthContext.jsx'

const LoginPage = () => {
  // State hooks
  const {
    isAuthed,
    authenticate,
    snackBarOpen,
    snackBarMessage,
    handleSnackBarClose
  } = useContext(AuthContext)

  // Return DOM elements
  if (isAuthed) {
    return <Redirect to='/patients' />
  }

  const renderForms = () => {
    return (
      <div>
        <Route exact path='/login/register'>
          <Registration authenticate={authenticate} />
        </Route>
        <Route exact path='/login'>
          <Login authenticate={authenticate} />
          <div style={{ padding: '5px 20px' }}>
            <Link to='/login/register' style={{ textDecoration: 'none' }}>
              <Button
                variant='contained'
                color='primary'
                style={{ width: '100%' }}>
                Register New User
              </Button>
            </Link>
          </div>
        </Route>
      </div>
    )
  }

  return (
    <div>
      <Snackbar
        open={snackBarOpen}
        message={snackBarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
      />
      <Container maxWidth='sm'>
        <Paper style={{ margin: '20px', padding: '30px', marginTop: '70px' }}>
          <Typography align='center' variant='h3' style={{ padding: '20px' }}>
            HN App
          </Typography>
          {renderForms()}
        </Paper>
      </Container>
    </div>
  )
}

export default useResponsive()(LoginPage)
