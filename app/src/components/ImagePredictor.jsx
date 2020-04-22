import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import BulkSelector from 'HNA/components/BulkSelector.jsx'

const ImagePredictor = (props) => {
  const { fetchPictures, visitId } = props

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h4' style={{ marginBottom: '15px' }}>
            Upload DICOMs
          </Typography>
          <BulkSelector visitId={visitId} fetchPictures={fetchPictures} />
        </Grid>
      </Grid>
    </div>
  )
}

export default ImagePredictor
