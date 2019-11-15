const predictions = require('./predictions/predictions.service.js')
const storage = require('./storage/storage.service.js')
const users = require('./users/users.service.js')

module.exports = function (app) {
  app.configure(predictions)
  app.configure(storage)
  app.configure(users)
}
