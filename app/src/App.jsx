import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import useResponsive from 'HNA/hooks/useResponsive'
import HeaderBar from 'HNA/components/HeaderBar.jsx'
import LoginPage from 'HNA/pages/LoginPage.jsx'
import HomePage from 'HNA/pages/HomePage.jsx'
import PatientPage from 'HNA/pages/PatientPage.jsx'

import AuthContext from 'HNA/components/AuthContext.jsx'
import PrivateRoute from 'HNA/components/PrivateRoute.jsx'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#66a2d4' },
    secondary: { main: '#db6a56' }
  }
})

const App = () => {
  return (
    <AuthContext>
      <ThemeProvider theme={theme}>
        <Router>
          <Route path='/'>
            <HeaderBar />
            <div>
              <Switch>
                <PrivateRoute path='/patient/:slug' component={PatientPage} />
                <Route path='/login' component={LoginPage} />
                <PrivateRoute path='/patients' component={HomePage} />
                <Route>
                  <Redirect to='/patients' />
                </Route>
              </Switch>
            </div>
          </Route>
        </Router>
      </ThemeProvider>
    </AuthContext>
  )
}

export default useResponsive()(App)
