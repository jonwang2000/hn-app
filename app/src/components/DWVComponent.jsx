import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import dwv from 'dwv'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// gui overrides, get element for dwv
dwv.gui.getElement = dwv.gui.base.getElement

const DWVComponent = props => {
  const {
    stateCrop,
    handleStateCrop,
    view,
    open,
    onClose,
    files,
    handleSubmit
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

  useEffect(() => {
    if (dwvApp && files) {
      dwvApp.loadFiles(files)
    }
  }, [dwvApp, files])

  const onChange = crop => setCrop(crop)

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

  const submitData = () => {
    handleSubmit(croppedData)
    handleStateCrop(crop)
    setCroppedData(null)
    setShowCropped(false)
    onClose(view)
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
    <Dialog maxWidth='xl' open={open} onClose={() => onClose(view)}>
      {!showCropped ? (
        <div
          id='dwv'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            width: '70vw',
            overflow: 'hidden'
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
                    width: '100%',
                    display: 'block',
                    padding: 0,
                    margin: 'auto'
                  }}
                />
              }
            />
          </div>
          <div>
            <Button onClick={handleNext}>Next</Button>
            <Button
              onClick={() => setCrop(stateCrop)}
              disabled={stateCrop === null}>
              Previous Crop
            </Button>
          </div>
        </div>
      ) : (
        <div
          id='dwv'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            width: '70vw'
          }}>
          <img src={croppedData} />
          <Button onClick={submitData}>Submit</Button>
        </div>
      )}
    </Dialog>
  )
}

export default DWVComponent
