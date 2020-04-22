module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      //Add hook for patching visit
      (context) => {
        const {
          visitId,
          probability,
          sagittalGradCamId,
          transverseGradCamId,
        } = context.result;

        return context.app
          .service("visits")
          .patch(visitId, { prob_surgery: probability })
          .then(() => {
            return context.app
              .service("images")
              .create({
                upload_id: sagittalGradCamId,
                visit_id: visitId,
                image_type: "gradcam_sagittal",
              })
              .then((res) => {
                console.log(res);
                return context.app
                  .service("images")
                  .create({
                    upload_id: transverseGradCamId,
                    visit_id: visitId,
                    image_type: "gradcam_transverse",
                  })
                  .then((res) => console.log(res))
                  .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      },
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
