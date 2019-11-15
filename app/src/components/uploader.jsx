import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import responsive from 'FRS/components/responsive.jsx'

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
    const { classes, onDrop } = this.props

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 100,
    }

    return (
      <div style={{ padding: '0 20px' }}>
        <Dropzone multiple onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            const style = { ...baseStyle, ...(isDragActive ? activeStyle : {})}

            return (
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p style={textStyle}>Drop files here...</p>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#47769f', boxShadow: 'none', color: '#fff' }}
                >
                  Select Files
                  &nbsp;
                  <CloudUploadIcon className={classes.rightIcon} />
                </Button>
              </div>
            )
          }}
        </Dropzone>
      </div>
    )
  }
}
