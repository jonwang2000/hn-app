import React, { useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

import Card from '@material-ui/core/Card'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ImagePredictor from 'HNA/components/ImagePredictor.jsx'

const Visit = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [imgs, setImgs] = useState([])

  const { id, handleResult } = props
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

  const fetchPictures = () => {
    app
      .service('images')
      .find({ query: { visit_id: id } })
      .then(res => {
        return res.data.map(obj => obj.upload_id)
      })
      .then(ids => {
        //TODO: clean this up/change logic
        let imagePromises = ids.map(id => app.service('uploads').get(id))
        if (data.prob_surgery) {
          return Promise.all(
            imagePromises.concat(
              ids.map(id => {
                const gradcamId = id.substr(0, id.lastIndexOf('.'))
                return app
                  .service('uploads')
                  .get(`${gradcamId}_Cam_On_Image_inferno.png`)
              })
            )
          )
        }
        return Promise.all(imagePromises)
      })
      .then(imgs => setImgs(imgs))
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (data) fetchPictures()
  }, [data])

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

  const renderImages = () =>
    imgs.map(img => (
      <div
        key={img.id}
        style={{
          display: 'table-cell',
          verticalAlign: 'top',
          padding: '10px'
        }}>
        <img
          src={img.uri}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    ))

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
            <ImagePredictor
              visitId={id}
              handleResult={() => {
                handleResult()
                fetchPictures()
              }}
            />
          </div>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <div style={{ padding: '20px' }}>
            <Typography variant='h3'>Previous Images</Typography>
            <div style={{ display: 'table' }}>{renderImages()}</div>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Visit
