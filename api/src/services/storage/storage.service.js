// Initializes the `storage` service on path `/uploads`

const hooks = require('./storage.hooks')

const blobService = require('feathers-blob')
const fs = require('fs-blob-store')


module.exports = function(app) {
  const blobStorage = fs('./uploads')

  app.use('/uploads', blobService({ Model: blobStorage }))

  const service = app.service('uploads')

  service.hooks(hooks)
}
