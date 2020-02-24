import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import useResponsive from 'DMF/hooks/useResponsive'
import LoginPage from 'DMF/pages/LoginPage.jsx'
import HomePage from 'DMF/pages/HomePage.jsx'

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/login'>
            <LoginPage />
          </Route>
          <Route path='/'>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default useResponsive()(App)
