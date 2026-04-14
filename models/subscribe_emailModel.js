const { DataTypes } = require('sequelize')
const { db } = require('../config/database')


// create Subscribe_email query
const Subscribe_emailQuery = db.define('Email_subscribe', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = { Subscribe_emailQuery }