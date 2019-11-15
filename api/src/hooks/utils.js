const path = require('path')
const { PythonShell } = require('python-shell')

// TODO: move to env file
exports.UPLOAD_PATH = '/home/node/uploads/'

exports.pythonExec = function(pythonScript, options) {
  return new Promise((resolve, reject) =>
    PythonShell.run(path.resolve(pythonScript), options , (err, results) => (err ? reject(err) : resolve(results)))
  )
}
