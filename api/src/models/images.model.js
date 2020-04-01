// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const images = sequelizeClient.define(
    "images",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      visit_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      upload_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image_type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      },
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  // eslint-disable-next-line no-unused-vars
  images.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return images;
};
