import React from 'react'

import Container from '@material-ui/core/Container'

import { useParams } from 'react-router-dom'

import useResponsive from 'HNA/hooks/useResponsive'
import Patient from 'HNA/components/Patient.jsx'

const PatientPage = () => {
  const { slug } = useParams()

  return (
    <Container>
      <Patient studyId={slug} />
    </Container>
  )
}

export default useResponsive()(PatientPage)
