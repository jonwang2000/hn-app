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
      //Add hook for patching visit
      context => {
        const { visitId, probability } = context.result;

        return context.app
          .service("visits")
          .patch(visitId, { prob_surgery: probability })
          .then(res => console.log(res))
          .catch(e => console.log(e));
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
};
