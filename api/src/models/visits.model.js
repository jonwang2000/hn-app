// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const visits = sequelizeClient.define(
    "visits",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      patient_id: {
        type: DataTypes.UUID,
        allowNull: false
      }, //TODO: indicate as FK somehow?
      uti: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      vcug: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      reflux: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      provider: {
        type: DataTypes.UUID,
        allowNull: false
      },
      function_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      function_test: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      prob_surgery: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      prob_function: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      prob_reflux: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      ultrasound_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      age_at_visit: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      surgery_indicated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      surgery_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      nuclear_scan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      prophylaxis: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
      // TODO: IMAGES
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
  visits.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return visits;
};
