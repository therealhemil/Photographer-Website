
// sequelize for databse setup
const { Sequelize } = require('sequelize')

// require database credentials
const db = new Sequelize(
  process.env.DB_DBNAME || 'photography_db',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
)

// check if database is connected or not
const connection = () => {
  db.authenticate()
    .then(() => {
      console.log("Mysql Connected Successfully");
    })
    .catch(err => {
      console.log("Mysql Error:", err.message);
    })
}

// call connection
connection()

//second option to connect Database
// const mysql = require("mysql2")

// // require database credentials
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USERNAME || 'root',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_DBNAME || 'photography_db',
//   // port: process.env.DB_PORT
// })

// Database connection success or error
// db.connect(err => {
//   if (err) {
//     console.log("DB Error:", err);
//     return
//   }

//   console.log("Mysql Connected");
// })

// const dbQuery = (query, values = []) => {
//   return new Promise((resolve, reject) => {
//     db.query(query, values, (err, result) => {
//       if (err) return reject(err)
//       resolve(result)
//     })
//   })
// }

module.exports = { db }
