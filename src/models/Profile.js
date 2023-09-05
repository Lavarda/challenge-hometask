const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Profile = sequelize.define(
  'Profile',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
    },
    type: {
      type: DataTypes.ENUM('client', 'contractor'),
    },
  },
  {
    sequelize,
    modelName: 'Profile',
  }
)

module.exports = Profile
