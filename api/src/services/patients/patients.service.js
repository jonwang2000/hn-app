// Initializes the `patients` service on path `/patients`
const { Patients } = require('./patients.class')
const createModel = require('../../models/patients.model')
const hooks = require('./patients.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/patients', new Patients(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('patients')

  service.hooks(hooks)
}
