// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const patients = sequelizeClient.define(
    "patients",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      study_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: false
      },
      surgery_performed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      surgery_age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      known_anomalies: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ethnicity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      postal_code: {
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
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  // eslint-disable-next-line no-unused-vars
  patients.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return patients;
};
