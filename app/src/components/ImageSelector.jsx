import React, { Component } from 'react'
import map from 'lodash/map'

import CircularProgress from '@material-ui/core/CircularProgress'

import app from 'HNA/feathers-client.js'
import Uploader from 'HNA/components/uploader.jsx'
import responsive from 'HNA/components/responsive.jsx'

@responsive
export default class ImageSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sagittalLoading: false,
      sagittalView: null,
      transverseLoading: false,
      transverseView: null
    }
  }

  onUpload = (files, view) => {
    this.setState({ [`${view}Loading`]: true })
    map(files, file => {
      const reader = new FileReader()

      reader.onload = () => app.service('uploads').create({ uri: reader.result })
        .then(result => this.setState({ [`${view}Loading`]: false, [`${view}View`]: result }))
        .then(() => this.checkComplete())
      reader.readAsDataURL(file)
    })
  }

  checkComplete = () => {
    const { onComplete } = this.props
    const { sagittalView, transverseView } = this.state

    return sagittalView && transverseView ? onComplete([sagittalView, transverseView]) : null
  }


  renderUploadSection = (view, loading, uploadOptions) =>
    <div
      style={{
        textAlign: 'center',
        ...loading && { alignItems: 'center', display: 'flex', height: '100%', justifyContent: 'center' } }}
    >
      { loading
        ? <CircularProgress />
        : view
          ? <div>
              <img style={{maxWidth: 200}} src={`data:image/png;base64,${view.png}`} />
              <Uploader {...uploadOptions} displayZone={false} buttonText="Change image" />
            </div>
          : <Uploader {...uploadOptions} displayZone />
      }
    </div>

  render() {
    const { sagittalLoading, sagittalView, transverseLoading, transverseView } = this.state
    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      padding: '0 20px',
      textAlign: 'left',
      marginBottom: 10
    }

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: '50%' }}>
            <div style={textStyle}>Saggital View:</div>
            {this.renderUploadSection(
              sagittalView,
              sagittalLoading,
              {
                buttonText: "Upload SAG",
                onDrop: file => this.onUpload(file, 'sagittal'),
                uploadText: "Drop your dicom file here"
              }
            )}
          </div>
          <div style={{ flexBasis: '50%' }}>
            <div style={textStyle}>Transverse View:</div>
            {this.renderUploadSection(
              transverseView,
              transverseLoading,
              {
                buttonText: "Upload TRV",
                onDrop: file => this.onUpload(file, 'transverse'),
                uploadText: "Drop your dicom file here"
              }
            )}
          </div>
        </div>
      </div>
    )
  }
}
