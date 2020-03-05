// Initializes the `visits` service on path `/visits`
const { Visits } = require('./visits.class')
const createModel = require('../../models/visits.model')
const hooks = require('./visits.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/visits', new Visits(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('visits')

  service.hooks(hooks)
}
