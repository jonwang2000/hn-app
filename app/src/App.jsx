import React, { Component } from 'react'
import map from 'lodash/map'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'
import Uploader from 'FRS/components/uploader.jsx'


@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      isLoading: true,

      uploadedFiles: [],
      showUploader: true,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  authenticate = (options) => {
    return app.authenticate({ strategy: 'local', ...options })
      .then(() => this.setState({ isAuthenticated: true }))
      .catch((err) => this.setState({
          isAuthenticated: false,
          snackBarOpen: true,
          snackBarMessage: 'Login failed, please check your email and/or password'
        })
      )
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  onDrop = (files) => {
    map(files, file => {
      const reader = new FileReader()

      reader.onload = () => app.service('uploads').create({ uri: reader.result })
        .then(result => this.setState(prev => ({ ...prev, uploadedFiles: [ ...prev.uploadedFiles, result ] })))
      reader.readAsDataURL(file)
    })

    this.setState({ showUploader: false })
  }

  handleScore = () => {
    const { uploadedFiles } = this.state
    const fileIDs = map(uploadedFiles, file => file.id)

    app.service('predictions').create({ files: fileIDs })
  }

  componentDidMount() {
    return app.authentication.getAccessToken()
      .then(accessToken => {
        if (accessToken) {
          return app.reAuthenticate()
            .then(() => this.setState({ isAuthenticated: true }))
        }
      })
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    const { onMobile } = this.props
    const { uploadedFiles, showUploader, snackBarOpen, snackBarMessage } = this.state

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 100,
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          position: 'absolute'
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <Paper
          elevation={onMobile ? 0 : 3}
          style={{
            padding: onMobile ? 10 : 20,
            position: 'relative',
            minHeight: 500,
            ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
          }}
        >
          <div
            style={{
              fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              textAlign: 'center',
              marginTop: onMobile ? 10 : 20,
              marginBottom: onMobile ? 10 : 40,
            }}
          >
            Hydronephrosis Predictor
          </div>
          {showUploader
            ? <div style={{ ...textStyle, margin: '60px auto', textAlign: 'center' }}>
                <Uploader onDrop={this.onDrop} />
              </div>
            : null
          }
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {map(uploadedFiles, (file) => <img style={{ maxWidth: 200 }} src={`data:image/png;base64,${file.png}`} />)}
          </div>
          <div style={{ margin: 20, textAlign: 'center' }}>
            {uploadedFiles.length > 0
              ? <Button
                  onClick={this.handleScore}
                  variant="contained"
                  style={{ backgroundColor: '#47769f', boxShadow: 'none', color: '#fff' }}
                >
                  Score
                </Button>
              : null
            }
          </div>
        </Paper>
      </div>
    )
  }
}
