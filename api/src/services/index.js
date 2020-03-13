const patients = require('./patients/patients.service.js')
const predictions = require('./predictions/predictions.service.js')
const storage = require('./storage/storage.service.js')
const users = require('./users/users.service.js')
const visits = require('./visits/visits.service.js')

const images = require('./images/images.service.js');

module.exports = function (app) {
  app.configure(patients)
  app.configure(predictions)
  app.configure(storage)
  app.configure(users)
  app.configure(visits)
  app.configure(images);
}
