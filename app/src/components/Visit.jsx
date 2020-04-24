//  Visit.jsx

//  The bulk of the work is done here and in child components of Visit.
//  Images are uploaded/categorized in BulkSelector and then predicted/displayed here.

//  TODO: cleanup/styling, images should be displayed in a better format

import React, { useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

import Promise from 'bluebird'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'

import BulkSelector from 'HNA/components/BulkSelector.jsx'

const Visit = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [imgs, setImgs] = useState([])

  const [isPredicting, setIsPredicting] = useState(false)
  const [predictions, setPredictions] = useState([])
  const [selectedPred, setSelectedPred] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)

  const { id, handleResult } = props

  const fetchData = () => {
    app
      .service('visits')
      .get(id)
      .then((res) => {
        setData(res)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  const fetchPictures = () => {
    app
      .service('images')
      .find({ query: { visit_id: id, $limit: 100 } })
      .then((res) => {
        return res.data
      })
      .then((objs) => {
        //TODO: clean this up/change logic
        let imagePromises = objs.map((obj) =>
          Promise.props({
            ...obj,
            upload: app.service('uploads').get(obj.upload_id),
          })
        )
        return Promise.all(imagePromises)
      })
      .then((imgs) => setImgs(imgs))
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (data) fetchPictures()
  }, [data])

  // Process and display runable algos TODO: better method than hard coding
  useEffect(() => {
    console.log(imgs, 'should process')
    if (imgs && imgs.length !== 0) {
      const imageTypes = imgs.map((img) => img.image_type)
      processPrediction(
        imageTypes,
        ['sagittal', 'transverse'],
        'normalPrediction'
      )
      processPrediction(
        imageTypes,
        ['l_sagittal', 'l_transverse'],
        'leftPrediction'
      )
      processPrediction(
        imageTypes,
        ['r_sagittal', 'r_transverse'],
        'rightPrediction'
      )
    }
  }, [imgs])

  useEffect(() => {
    console.log(predictions)
  }, [predictions])

  //  checks and changes usable prediction algos if all required image types are available
  //  TODO: not sure if this is the best method, processing functionality needs cleanup
  const processPrediction = (imageTypes, includeTypes, predictionName) => {
    if (includeTypes.every((type) => imageTypes.includes(type))) {
      if (predictions.includes(predictionName)) {
        return
      }
      setPredictions((predictions) => [...predictions, predictionName])
    } else {
      setPredictions((predictions) =>
        predictions.filter((prediction) => prediction !== predictionName)
      )
    }
  }

  //  TODO: same as above
  const predict = () => {
    console.log(id)
    let fileIds = []

    switch (selectedPred) {
      case 'normalPrediction':
        fileIds = [
          imgs.find((img) => img.image_type === 'sagittal').upload_id,
          imgs.find((img) => img.image_type === 'transverse').upload_id,
        ]
        break
      case 'leftPrediction':
        fileIds = [
          imgs.find((img) => img.image_type === 'l_sagittal').upload_id,
          imgs.find((img) => img.image_type === 'l_transverse').upload_id,
        ]
        break
      case 'rightPrediction':
        fileIds = [
          imgs.find((img) => img.image_type === 'r_sagittal').upload_id,
          imgs.find((img) => img.image_type === 'r_transverse').upload_id,
        ]
        break
      default:
        return
    }

    setIsPredicting(true)

    app
      .service('predictions')
      .create({ files: fileIds, visitId: id })
      .then((res) => {
        console.log(res)
        return setIsPredicting(false)
      })
      .then(() => {
        handleResult()
        fetchPictures()
      }) // Refresh table
      .catch((e) => console.log(e))
  }

  const deleteImage = (id) => {
    app
      .service('images')
      .remove(id)
      .then((res) => {
        console.log(res)
        fetchPictures()
      })
  }

  const onClose = () => setDialogOpen(false)

  const renderVisitInfo = () => {
    return Object.keys(data).map((key) => (
      <div key={key}>
        <Typography variant='body1'>
          <span style={{ fontWeight: 'bold' }}>{key}:</span>
          <span>{data[key]}</span>
        </Typography>
      </div>
    ))
  }

  //  TODO: Display in a better, more legible format.
  //  A suggestion was to do a table with image thumbnails that displays fullsize image when row clicked.
  const renderImages = () =>
    imgs.map((img) => (
      <Grid item xs={4} key={img.id}>
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'top',
            padding: '10px',
          }}>
          <img
            src={img.upload.uri}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <p>{img.image_type}</p>
          <Button onClick={() => deleteImage(img.id)}>Delete</Button>
        </div>
      </Grid>
    ))

  const renderUploadDialog = () => {
    return (
      <Dialog open={dialogOpen} onClose={onClose} maxWidth='xl' fullWidth>
        <BulkSelector
          visitId={id}
          onClose={onClose}
          fetchPictures={fetchPictures}
        />
      </Dialog>
    )
  }

  if (isLoading) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Card>
    )
  }
  return (
    <div>
      {renderUploadDialog()}
      <Grid container item spacing={4} alignItems='stretch'>
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%' }}>
            <div style={{ padding: '20px' }}>{renderVisitInfo()}</div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ height: '100%' }}>
            <div style={{ padding: '20px' }}>
              <Typography variant='h4'>Run Algorithm</Typography>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}>
                <Select
                  value={selectedPred}
                  onChange={(e) => setSelectedPred(e.target.value)}>
                  {predictions.map((pred) => (
                    <MenuItem key={pred} value={pred}>
                      {pred}
                    </MenuItem>
                  ))}
                </Select>
                {isPredicting ? (
                  <CircularProgress />
                ) : (
                  <Button
                    disabled={selectedPred === ''}
                    onClick={predict}
                    variant='contained'>
                    RUN
                  </Button>
                )}
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}>
                <Button onClick={() => setDialogOpen(true)} variant='outlined'>
                  Upload
                </Button>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <div style={{ padding: '20px', minHeight: '100px' }}>
              <Typography variant='h4'>Uploaded Images</Typography>
              <Grid container spacing={4}>
                {renderImages()}
              </Grid>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Visit
