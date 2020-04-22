import React, { useEffect, useState } from 'react'

import app from 'HNA/feathers-client.js'

import dwv from 'dwv'
import pEvent from 'p-event'
import Promise from 'bluebird'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import BulkUploader from 'HNA/components/BulkUploader.jsx'
import DWVComponent from 'HNA/components/DWVComponent.jsx'

const BulkSelector = props => {
  const { fetchPictures, visitId } = props

  const [bulkFiles, setBulkFiles] = useState([])

  const [dwvDialogOpen, setDwvDialogOpen] = useState(false)
  const [stateCrop, setStateCrop] = useState(null)
  const [dwvApp, setDwvApp] = useState(null)

  const [uris, setUris] = useState([])
  const [imgDialogOpen, setImgDialogOpen] = useState(false)

  useEffect(() => {
    if (bulkFiles && bulkFiles.length !== 0) {
      if (!stateCrop) {
        setDwvDialogOpen(true)
      }
    }
  }, [bulkFiles])

  useEffect(() => {
    const app = new dwv.App()
    app.init({ containerDivId: 'renderer' })
    setDwvApp(app)
  }, [])

  useEffect(() => {
    if (bulkFiles && bulkFiles.length !== 0 && stateCrop) {
      convertFiles(bulkFiles)
    }
  }, [bulkFiles, stateCrop])

  useEffect(() => {
    if (uris && uris.length !== 0) {
      setImgDialogOpen(true)
    }
  }, [uris])

  //  Converts given files to png datauris by rendering onto
  //  the hidden dwv canvas one-by-one, then cropping
  const convertFiles = files => {
    Promise.mapSeries(files, file => {
      dwvApp.loadFiles([file])
      return pEvent(dwvApp, 'load-end')
        .then(e => {
          const canvas = document.getElementById('rendererCanvas')
          const imageData = canvas.toDataURL('image/png')
          return imageData
        })
        .catch(err => console.error(err))
    })
      .then(uris =>
        Promise.mapSeries(uris, uri => {
          return getCroppedImg(uri)
        })
      )
      .then(uris =>
        setUris(
          uris.map(uri => {
            return { uri: uri, image_type: '' }
          })
        )
      )
  }

  // Handlers
  const handleStateCrop = crop => setStateCrop(crop)

  const handleSubmit = () => {}

  const dwvDialogClose = () => setDwvDialogOpen(false)

  const imgDialogClose = () => {
    setBulkFiles([])
    setUris([])
    setStateCrop(null)
    setImgDialogOpen(false)
  }

  const handleSelect = (e, inputUri) => {
    console.log(e.target.value)
    setUris(
      uris.map(uri =>
        uri.uri === inputUri
          ? { uri: uri.uri, image_type: e.target.value }
          : uri
      )
    )
  }

  const uploadUris = () => {
    // Upload all images with tags
    setImgDialogOpen(false)

    uris.forEach(uri => upload({ visit_id: visitId, ...uri }))
  }

  const upload = obj => {
    app
      .service('uploads')
      .create(obj)
      .then(res => {
        console.log(res)
        fetchPictures()
      })
  }

  // Utility func for getting cropped portion as a canvas
  const getCroppedImg = dataUrl => {
    const promise = new Promise((resolve, reject) => {
      const img = new Image()
      img.src = dataUrl
      img.onload = () => {
        const croppedCanvas = document.createElement('canvas')
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height
        croppedCanvas.width = stateCrop.width
        croppedCanvas.height = stateCrop.height
        const ctx = croppedCanvas.getContext('2d')

        ctx.drawImage(
          img,
          stateCrop.x * scaleX,
          stateCrop.y * scaleY,
          stateCrop.width * scaleX,
          stateCrop.height * scaleY,
          0,
          0,
          stateCrop.width,
          stateCrop.height
        )

        resolve(croppedCanvas.toDataURL('image/png'))
      }
    })

    return promise
  }

  // Rendering functions
  const renderDwvDialog = () =>
    dwvDialogOpen ? (
      <DWVComponent
        view={'test'}
        files={bulkFiles}
        handleSubmit={handleSubmit}
        open={dwvDialogOpen}
        onClose={dwvDialogClose}
        stateCrop={stateCrop}
        handleStateCrop={handleStateCrop}
      />
    ) : null

  const renderImgDialog = () => (
    <Dialog
      open={imgDialogOpen}
      onClose={imgDialogClose}
      style={{ overflow: 'hidden' }}
      maxWidth='xl'>
      {uris.map(uri => (
        <div
          key={uri.uri}
          style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
          <img
            src={uri.uri}
            style={{ width: '80%', border: '1px solid #000' }}
          />
          <select onChange={e => handleSelect(e, uri.uri)}>
            <option value={''}>N/A</option>
            <option value='l_transverse'>Left Transverse</option>
            <option value='l_sagittal'>Left Sagittal</option>
            <option value='r_transverse'>Right Transverse</option>
            <option value='r_sagittal'>Right Sagittal</option>
          </select>
        </div>
      ))}
      <div>
        <Button onClick={imgDialogClose}>Cancel</Button>
        <Button onClick={uploadUris}>Submit</Button>
      </div>
    </Dialog>
  )

  return (
    <div style={{ width: '100%' }}>
      {renderDwvDialog()}
      {renderImgDialog()}
      <BulkUploader
        uploadText='Drop DICOMs here'
        buttonText='Upload Bulk'
        onDrop={files => setBulkFiles(files)}
        style={{ width: '100%' }}
      />

      {/* Really hacky fix for dwv */}
      <div id='renderer' style={{ position: 'fixed', visibility: 'hidden' }}>
        <div className='layerContainer'>
          <canvas id='rendererCanvas' className='imageLayer' />
        </div>
      </div>
    </div>
  )
}

export default BulkSelector
