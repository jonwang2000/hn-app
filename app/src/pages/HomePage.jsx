import React from 'react'

import { withRouter } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import useResponsive from 'HNA/hooks/useResponsive'
import Patients from 'HNA/components/Patients.jsx'

const HomePage = (props) => {
  return (
    <Container>
      <Patients history={props.history} />
    </Container>
  )
}

export default useResponsive()(withRouter(HomePage))
