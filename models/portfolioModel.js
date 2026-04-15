const {DataTypes} = require('sequelize')
const {db} = require('../config/database')

// create query to store signup database data
const PortfolioQuery = db.define('Portfolio_images',{
    title :{
        type: DataTypes.STRING,
        allowNull: true
    },
    images : { 
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
})

module.exports ={PortfolioQuery}