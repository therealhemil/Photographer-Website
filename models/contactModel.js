// const { dbQuery } = require("../config/database")
// const { Contact_Table} = require("../config/constant")

// create Query using sequelize
const { DataTypes } = require('sequelize')
const { db } = require('../config/database')

// create query to insert data into database
const contactMessageQuery = db.define("contact_us", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = { contactMessageQuery }






// const createContactMessage = ({ name, email, phone, msg }) => {
//     const query = `INSERT INTO ${Contact_Table.TableName} (${Contact_Table.TableColumns.join(", ")}) VALUES (?,?,?,?)`
//     return dbQuery(query, [name, email, phone, msg])
// }
// module.exports = {createContactMessage}