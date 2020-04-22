import React, { useEffect, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import useResponsive from 'HNA/hooks/useResponsive'

import app from 'HNA/feathers-client.js'

import DWVComponent from 'HNA/components/DWVComponent.jsx'
import Uploader from 'HNA/components/Uploader.jsx'

const ImageSelector = (props) => {
  const { visitId, onComplete } = props

  // Emulating class state because of the ways keys were handled
  const [state, setFuncState] = useState({
    sagittalLoading: false,
    sagittalView: null,
    transverseLoading: false,
    transverseView: null,
  })

  const setState = (stateObj) => {
    setFuncState({ ...state, ...stateObj })
  }

  // State hooks (new)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogView, setDialogView] = useState(null)
  const [dialogFiles, setDialogFiles] = useState(null)
  const [dialogResult, setDialogResult] = useState(null)
  const [stateCrop, setStateCrop] = useState(null)

  const handleStateCrop = (crop) => setStateCrop(crop)

  // API call for uploading dataURL
  const upload = () => {
    setState({ [`${dialogView}Loading`]: true })

    app
      .service('uploads')
      .create({ uri: dialogResult, visit_id: visitId, image_type: dialogView })
      .then((result) =>
        setState({
          [`${dialogView}Loading`]: false,
          [`${dialogView}View`]: result,
        })
      )
  }

  useEffect(() => {
    if (dialogResult) {
      upload()
    }
  }, [dialogResult])

  // Sets data based on inputted file then opens DWVComponent
  const setDicom = (files, view) => {
    setState({ [`${view}Loading`]: true })
    setDialogFiles(files)
    setDialogView(view)
    setDialogOpen(true)
  }

  const handleSubmit = (uri) => setDialogResult(uri)

  // Replace checkComplete
  useEffect(() => {
    const { sagittalView, transverseView } = state

    if (sagittalView && transverseView) {
      onComplete([sagittalView, transverseView])
    }
  }, [state])

  const onClose = (view) => {
    setState({ [`${view}Loading`]: false })
    setDialogOpen(false)
  }

  const renderDialog = () => {
    if (dialogOpen) {
      return (
        <DWVComponent
          view={dialogView}
          files={dialogFiles}
          handleSubmit={handleSubmit}
          open={dialogOpen}
          onClose={onClose}
          stateCrop={stateCrop}
          handleStateCrop={handleStateCrop}
        />
      )
    }
  }

  const renderUploadSection = (view, loading, uploadOptions) => (
    <div
      style={{
        textAlign: 'center',
        ...(loading && {
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        }),
      }}>
      {loading ? (
        <CircularProgress />
      ) : view ? (
        <div>
          <img style={{ maxWidth: 200 }} src={`${view.uri}`} />
          <Uploader
            {...uploadOptions}
            displayZone={false}
            buttonText='Change image'
          />
        </div>
      ) : (
        <Uploader {...uploadOptions} displayZone />
      )}
    </div>
  )

  // RENDER
  const {
    sagittalLoading,
    sagittalView,
    transverseLoading,
    transverseView,
  } = state

  return (
    <div style={{ marginTop: '10px' }}>
      {renderDialog()}
      <div style={{ display: 'flex' }}>
        <div style={{ flexBasis: '50%' }}>
          {renderUploadSection(sagittalView, sagittalLoading, {
            buttonText: 'Upload SAG',
            onDrop: (file) => setDicom(file, 'sagittal'),
            uploadText: 'Drop dicom file here',
          })}
        </div>
        <div style={{ flexBasis: '50%' }}>
          {renderUploadSection(transverseView, transverseLoading, {
            buttonText: 'Upload TRV',
            onDrop: (file) => setDicom(file, 'transverse'),
            uploadText: 'Drop dicom file here',
          })}
        </div>
      </div>
    </div>
  )
}

export default useResponsive()(ImageSelector)
