const { DataTypes } = require("sequelize");
const { db } = require("../config/database");


// create content page Dyanamic content update.
const contactPageQuery = db.define('contactPage_ContentUpdate',{
    address:{
        type: DataTypes.STRING
    },
    phone_number:{
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
    }
})

module.exports = {contactPageQuery}