import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import responsive from 'HNA/components/responsive.jsx'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const activeStyle = {
  textAlign: 'center',
  borderColor: '#47769f'
}

const styles = theme => ({
  iconSmall: {
    fontSize: 20,
  }
})

@withStyles(styles)
@responsive
export default class Uploader extends Component {
  render() {
    const { classes, onDrop, buttonText, uploadText, displayZone=true } = this.props

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 20,
      fontWeight: 100,
      marginBottom: 20,
      textAlign: 'center'
    }

    return (
      <div style={{ padding: '0 20px' }}>
        <Dropzone multiple={false} onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            const style = displayZone ? { ...baseStyle, ...(isDragActive ? activeStyle : {})} : {}

            return (
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {displayZone
                  ? <div style={textStyle}>{uploadText ? uploadText : 'Drop file here...'}</div>
                  : null
                }
                <Button variant="contained" style={{ backgroundColor: '#47769f', boxShadow: 'none', color: '#fff' }} size="small">
                  {buttonText ? buttonText : 'Select File'}
                </Button>
              </div>
            )
          }}
        </Dropzone>
      </div>
    )
  }
}
