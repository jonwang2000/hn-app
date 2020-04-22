module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      context => {
        const upload_id = context.result.id
        const { visit_id, image_type } = context.data

        console.log(visit_id, image_type)

        return context.app
          .service("images")
          .find({ query: { visit_id, image_type } })
          .then(res => {
            if (res.data[0] && image_type !== '') {
              return context.app
                .service("images")
                .patch(res.data[0].id, { upload_id: upload_id })
                .then(res => console.log(res))
                .catch(err => console.error(err))
            }
            else {
              return context.app
                .service("images")
                .create({
                  upload_id,
                  visit_id,
                  image_type
                })
                .then(res => console.log(res))
                .catch(err => console.error(err))
            }
          })
          .catch(err => console.log(err))
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
