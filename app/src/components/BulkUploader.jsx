import React from 'react'

import Button from '@material-ui/core/Button'
import Dropzone from 'react-dropzone'

const activeStyle = {
  textAlign: 'center',
  borderColor: '#47769f'
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '100px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const textStyle = {
  fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
  fontSize: 20,
  fontWeight: 100,
  marginBottom: 20,
  textAlign: 'center'
}

const BulkUploader = props => {
  const { onDrop, buttonText, uploadText, displayZone = true } = props

  return (
    <div style={{ padding: '50px' }}>
      <Dropzone multiple onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          const style = displayZone
            ? { ...baseStyle, ...(isDragActive ? activeStyle : {}) }
            : {}

          return (
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {displayZone ? (
                <div style={textStyle}>
                  {uploadText ? uploadText : 'Drop file here...'}
                </div>
              ) : null}
              <Button
                variant='contained'
                style={{
                  backgroundColor: '#47769f',
                  boxShadow: 'none',
                  color: '#fff'
                }}
                size='small'>
                {buttonText ? buttonText : 'Select File'}
              </Button>
            </div>
          )
        }}
      </Dropzone>
    </div>
  )
}

export default BulkUploader
