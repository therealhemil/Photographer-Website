// .env file config
require('dotenv').config({path: './.gitignore/.env'})

//express
const express = require('express');
const app = express();
const path = require('path')

// cookie-parser to set token in cookie as a moddileware
const cookieParser = require('cookie-parser')


// use morgan for logging
// const morgan = require("morgan")
// app.use(morgan('dev'))

// mysql2
const {db} = require('./config/database')
//check if database sync or not
db.sync().then(()=>{
    console.log("Database is Synced");
}).catch(err => {
    console.log("Error Database Syncing", err.message);
})


//use middleware
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


// view engine set
app.set("view engine", "ejs")
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "views","partials"),
    path.join(__dirname, "views","layouts")
])


//pages routes call
const pageRoute = require("./routes/pageRoute")

//contact_form & Subscribe_email_form & signup_form route call
const enagagementController = require("./routes/engagementRoute") 

// admin_dashboard route call
const admin_dashboard = require('./routes/adminRoute')
//signup_form call
// const userController = require("./routes/engagementRoute")


//route pages
app.use("/", pageRoute)
app.use("/", enagagementController)
app.use("/", enagagementController)
app.use("/", admin_dashboard)
// app.use("/", enagagementController)

//listen server port
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port localhost:${PORT}`));
