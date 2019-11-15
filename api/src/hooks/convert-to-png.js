const fs = require('fs')
const convertDicomPath = '/home/node/scripts/convert_dicom_to_png.py'

const { pythonExec, UPLOAD_PATH } = require('./utils.js')

/*
  After hook on uploads/storage which takes the resulting uploaded dicom file and creates a png copy
 */
module.exports = () => {
  return function (context) {
    const filePath = UPLOAD_PATH + context.result.id

    return pythonExec(convertDicomPath, { args: [filePath], pythonPath: '/usr/bin/python' })
      .then(() => {
        // Convert image to base64 data and add it to the result
        context.result.png = fs.readFileSync(filePath.split('.')[0] + '.png', 'base64')

        return context
      })
      .catch(err => console.error('Error processing DICOM:', err))
  }
}
