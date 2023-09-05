const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Contract = sequelize.define(
  'Contract',
  {
    terms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'in_progress', 'terminated'),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
  }
)

module.exports = Contract
