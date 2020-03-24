import React, { useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'

import ImageSelector from 'HNA/components/ImageSelector.jsx'

const ImagePredictor = props => {
  const { handleResult, visitId } = props

  const [isReadyToPredict, setIsReadyToPredict] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)

  const handleScore = () => {
    const fileIDs = uploadedFiles.map(file => file.id)

    if (isReadyToPredict) {
      setIsPredicting(true)

      app
        .service('predictions')
        .create({ files: fileIDs, visitId })
        .then(res => {
          return setIsPredicting(false)
        })
        .then(() => handleResult())
        .catch(e => console.log(e))
    }
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ImageSelector
            onComplete={files => {
              console.log('oncomplete')
              setUploadedFiles(files)
              setIsReadyToPredict(true)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
            {isPredicting ? (
              <CircularProgress />
            ) : (
              <Button
                disabled={!isReadyToPredict}
                onClick={handleScore}
                variant='contained'>
                run
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default ImagePredictor
