import React, { useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

import Card from '@material-ui/core/Card'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ImageSelector from 'HNA/components/ImageSelector.jsx'

const Visit = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  const { id } = props
  const fetchData = () => {
    app
      .service('visits')
      .get(id)
      .then(res => {
        setData(res)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const renderVisitInfo = () => {
    return Object.keys(data).map(key => (
      <div key={key}>
        <Typography variant='body1'>
          <span style={{ fontWeight: 'bold' }}>{key}:</span>
          <span>{data[key]}</span>
        </Typography>
      </div>
    ))
  }

  if (isLoading) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Card>
    )
  }
  return (
    <Grid container item spacing={4} alignItems='stretch'>
      <Grid item xs={12} sm={6}>
        <Card>
          <div style={{ padding: '20px' }}>{renderVisitInfo()}</div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card style={{ height: '100%' }}>
          <div style={{ padding: '20px' }}>
            <ImageSelector />
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Visit
