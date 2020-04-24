import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import dwv from 'dwv'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// gui overrides, get element for dwv
dwv.gui.getElement = dwv.gui.base.getElement

/*
  Overview/TODO:

  Takes in given files (DICOMs) and then displays them in a react-image-crop cropper,
  where they are then saved as .png dataURLs.

  Currently really, really hacky code, styling is bad too.

  The dwv canvas system really doesn't work well with the cropper.
*/

const DWVComponent = props => {
  const {
    stateCrop,
    handleStateCrop,
    open,
    onClose,
    files
  } = props

  // State hooks
  const [dwvApp, setDwvApp] = useState(null)
  const [crop, setCrop] = useState(null)
  const [croppedData, setCroppedData] = useState(null)
  const [showCropped, setShowCropped] = useState(false)

  // Set and init app, then store in state, update with stateCrop when loaded
  useEffect(() => {
    const app = new dwv.App()
    app.init({ containerDivId: 'dwv' })

    app.addEventListener('load-end', e => setCrop(stateCrop))

    setDwvApp(app)
  }, [])

  // If ready, then load the files; !showCropped is there so you can go back/cancel
  useEffect(() => {
    if (dwvApp && files && !showCropped) {
      dwvApp.loadFiles(files)
    }
  }, [dwvApp, files, showCropped])

  // Cropping onChange function
  const onChange = crop => setCrop(crop)

  // When user is satisfied with crop
  const handleNext = () => {
    const canvas = document.getElementById('canvas')
    const imageData = canvas.toDataURL()

    if (crop) {
      getCroppedImg(imageData)
    } else {
      setCroppedData(imageData)
    }
    setShowCropped(true)
  }

  // Submit cropped to API
  const submitData = () => {
    handleStateCrop(crop)
    setCroppedData(null)
    setShowCropped(false)
    onClose()
  }

  // Utility func for getting cropped portion as a canvas
  const getCroppedImg = dataUrl => {
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      const croppedCanvas = document.createElement('canvas')
      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height
      croppedCanvas.width = crop.width
      croppedCanvas.height = crop.height
      const ctx = croppedCanvas.getContext('2d')

      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      const base64Image = croppedCanvas.toDataURL('image/png')
      setCroppedData(base64Image)
    }
  }

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      {!showCropped ? (
        <div
          id='dwv'
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div className='layerContainer'>
            <ReactCrop
              src={null}
              crop={crop}
              onChange={onChange}
              renderComponent={
                <canvas
                  id='canvas'
                  className='imageLayer'
                  style={{
                    display: 'block',
                    padding: 0,
                    margin: 'auto'
                  }}
                />
              }
            />
          </div>
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => setCrop(stateCrop)}
              disabled={stateCrop === null}>
              Previous Crop
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      ) : (
        <div
          id='dwv'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <img src={croppedData} />
          <div>
            <Button onClick={() => setShowCropped(false)}>Back</Button>
            <Button onClick={submitData}>Submit</Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default DWVComponent
