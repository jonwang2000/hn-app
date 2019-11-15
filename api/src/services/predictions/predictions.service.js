// Initializes the `predictions` service on path `/predictions`
const get = require('lodash/get')

const hooks = require('./predictions.hooks')
const { pythonExec, UPLOAD_PATH } = require('../../hooks/utils.js')
const gradcamSingleRunPath = '/home/node/scripts/gradcam_singlerun.py'

module.exports = function(app) {
  class Prediction {
    create(data) {
      console.log('CALLED PREDICTIONS SERVICE WITH PARAMS: ', data)

      const files = get(data, 'files', [])
      if (files.length !== 2) {
        throw new Error('Two views required to run scoring algorithm')
      }

      const sag_path = UPLOAD_PATH + files[1].split(".")[0] + '.png'
      const trans_path = UPLOAD_PATH + files[0].split(".")[0] + '.png'

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
          console.log('FINISHED with ', result)

          return result
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
