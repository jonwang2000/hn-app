// Initializes the `predictions` service on path `/predictions`
const fs = require('fs')
const get = require('lodash/get')

const hooks = require('./predictions.hooks')
const { pythonExec, UPLOAD_PATH } = require('../../hooks/utils.js')
const gradcamSingleRunPath = '/home/node/scripts/gradcam_singlerun.py'

module.exports = function(app) {
  class Prediction {
    create(data) {
      const visitId = get(data, 'visitId', null)
      const files = get(data, 'files', [])

      console.log(files)
      console.log(UPLOAD_PATH)

      if (files.length !== 2) {
        throw new Error('Two views required to run scoring algorithm')
      }

      const saggital = files[0].split(".")[0]
      const sag_path = UPLOAD_PATH + saggital + '.png'

      const transverse = files[1].split(".")[0]
      const trans_path = UPLOAD_PATH + transverse + '.png'

      return pythonExec(
        gradcamSingleRunPath,
        {
          args: [
            '--sag_path=' + sag_path,
            '--trans_path=' + trans_path,
            '--outdir=' + UPLOAD_PATH,
            '-checkpoint=/home/node/scripts/prehdict_20190802_vanilla_siamese_dim256_c1_checkpoint_18.pth'
          ],
          pythonPath: '/usr/bin/python3'
        }
      )
        .then(result => {
          const probability = get(result, [2], '').split('::: ')[1]
          const sagittalPreProcessed = fs.readFileSync(UPLOAD_PATH + saggital + '_preprocessed.jpg', { encoding: 'base64' })
          const sagittalGradCam = fs.readFileSync(UPLOAD_PATH + saggital + '_Cam_On_Image_inferno.png', { encoding: 'base64' })
          const transversePreProcessed = fs.readFileSync(UPLOAD_PATH + transverse + '_preprocessed.jpg', { encoding: 'base64' })
          const transverseGradCam = fs.readFileSync(UPLOAD_PATH + transverse + '_Cam_On_Image_inferno.png', { encoding: 'base64' })

          return {
            visitId,
            probability,
            sagittalPreProcessed,
            sagittalGradCam,
            transversePreProcessed,
            transverseGradCam
          }
        })
        .catch(error => {
          console.log('ERROR with ', error)

          return error
        })
    }
  }

  app.use('/predictions', new Prediction())

  const service = app.service('predictions')
  service.hooks(hooks)
}
