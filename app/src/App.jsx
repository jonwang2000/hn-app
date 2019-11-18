import React, { Component } from 'react'
import map from 'lodash/map'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'DMF/feathers-client.js'
import responsive from 'DMF/components/responsive.jsx'
import ImageSelector from 'DMF/components/ImageSelector.jsx'

@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      isLoading: true,

      isReadyToPredict: false,
      isPredicting: false,
      results: null,

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

  handleScore = () => {
    const { isReadyToPredict, uploadedFiles } = this.state
    const fileIDs = map(uploadedFiles, file => file.id)

    if(isReadyToPredict) {
      this.setState({ isPredicting: true })

      app.service('predictions').create({ files: fileIDs })
        .then(results => {
          this.setState({ isPredicting: false, results })
        })
    }
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

  renderDicomUpload() {
    const { isReadyToPredict, isPredicting, results } = this.state

    if (!isPredicting && !results) {
      return (
        <div>
          <ImageSelector onComplete={uploadedFiles => this.setState({isReadyToPredict: true, uploadedFiles})}/>
          <div style={{margin: 60, textAlign: 'center'}}>
            <Button
              disabled={!isReadyToPredict}
              onClick={this.handleScore}
              variant="contained"
              style={{
                backgroundColor: isReadyToPredict ? '#c51162' : '#afafaf',
                boxShadow: 'none',
                color: '#fff',
                fontSize: 16
              }}
            >
              Predict
            </Button>
          </div>
        </div>
      )
    }
  }

  renderPredicting() {
    const { isPredicting } = this.state

    if (isPredicting) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
              fontSize: 16,
              fontWeight: 400,
              padding: '0 20px',
              textAlign: 'center',
              marginBottom: 40
            }}
          >
            Calculating surgery probability, this may take a couple of minutes...
          </div>
          <CircularProgress color='secondary' />
        </div>
      )
    }
  }

  renderResults() {
    const { results } = this.state
    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      textAlign: 'left',
      marginBottom: 10
    }

    if (results) {
      const { probability, sagittalPreProcessed, sagittalGradCam, transversePreProcessed, transverseGradCam } = results

      return (
        <div>
          <div
            style={{
              fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
              fontSize: 22,
              fontWeight: 100,
              marginBottom: 20,
              textAlign: 'center'
            }}
          >
            {`Probability of surgery is: `}
            <span style={{ fontSize: 26, fontWeight: 700 }}>{probability}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flexBasis: '50%', padding: '0 20px' }}>
              <div style={textStyle}>Saggital View:</div>
              <img style={{maxWidth: 200}} src={`data:image/png;base64,${sagittalPreProcessed}`}/>
              <div style={{ ...textStyle, fontSize: 14, fontWeight: 100, marginBottom: 20 }}>
                Pre-processed cropped image
              </div>
              <img style={{maxWidth: 200}} src={`data:image/png;base64,${sagittalGradCam}`}/>
              <div style={{ ...textStyle, fontSize: 14, fontWeight: 100, marginBottom: 0 }}>
                Grad Cam view
              </div>
            </div>
            <div style={{ flexBasis: '50%', padding: '0 20px' }}>
              <div style={textStyle}>Transverse View:</div>
              <img style={{maxWidth: 200}} src={`data:image/png;base64,${transversePreProcessed}`}/>
              <div style={{ ...textStyle, fontSize: 14, fontWeight: 100, marginBottom: 20 }}>
                Pre-processed cropped image
              </div>
              <img style={{maxWidth: 200}} src={`data:image/png;base64,${transverseGradCam}`}/>
              <div style={{ ...textStyle, fontSize: 14, fontWeight: 100, marginBottom: 0 }}>
                Grad Cam view
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <a
              style={{
                color: '#47769f',
                fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                textDecoration: 'none'
              }}
              href="/"
            >
              Click here to start a new prediction
            </a>
          </div>
        </div>
      )
    }
  }

  render() {
    const { onMobile } = this.props
    const { snackBarOpen, snackBarMessage } = this.state

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
            minHeight: 472,
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
          {this.renderDicomUpload()}
          {this.renderPredicting()}
          {this.renderResults()}
        </Paper>
      </div>
    )
  }
}
