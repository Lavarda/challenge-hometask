const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Job = sequelize.define('Job', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    paid: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    paymentDate: {
        type: DataTypes.DATE,
    },
},
{
    sequelize,
    modelName: 'Job',
})

module.exports = Job