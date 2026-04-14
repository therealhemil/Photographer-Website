const {DataTypes} = require('sequelize')
const {db} = require('../config/database')

// create query to store signup database data
const UserQuery = db.define('User',{
    first_name :{
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name :{
        type:DataTypes.STRING,
        allowNull :false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique :true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.ENUM("male","female",'other'),
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM("admin","user"),
        defaultValue : 'user'
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue : false
    }
})

module.exports ={UserQuery}