const { DataTypes } = require("sequelize");
const { db } = require("../../config/database");


// create content page Dyanamic content update.
const contactPageQuery = db.define('contactPage_DyanamicUpdate',{
    key:{
        type: DataTypes.STRING,
        unique:true
    },
    value:{
        type: DataTypes.STRING
    }
})

module.exports = {contactPageQuery}