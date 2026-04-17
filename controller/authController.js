const { UserQuery } = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { createAuthToken, setAuthCookie } = require('../utils/jwt')

//check userSignup Query and message shown accordingly
const submitSignupForm = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password, gender } = req.body
    console.log(req.body);

    //password & confirm_password enter wrong
    if (password !== confirm_password) {
        return res.json({
            message: "Password not Match",
            type: "error"
        })
    }

    //check email is already signup
    const emailExist = await UserQuery.findOne({ where: { email } })
    if (emailExist) {
        return res.json({
            message: "Already Signup, Please Login",
            type: 'error'
        })
    }


    //if new user
    try {
        //brefore create new entry password convert into hashpassword
        const saltRounds = 10
        const hashpassword = await bcrypt.hash(password, saltRounds)

        //create new user entry
        await UserQuery.create({ first_name, last_name, email, password: hashpassword, gender })
        return res.json({
            message: `${first_name}, Successfully Signup`,
            type: 'success'
        })
    } catch (err) {
        console.log("Signup User Error:", err);
        return res.json({
            message: 'Server Error',
            type: 'error'
        })

    }

}


//admin login controller
const loginAdmin = async (req, res) => {
    const { email, password } = req.body
    // console.log(req.body);

    try {

        //check email is already 
        const admin = await UserQuery.findOne({ where: { email } })
        if (!admin) {
            return res.status(400).json({
                message: "Admin not Found!",
                type: 'error'
            })
        }

        //compare admin input password and database password
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong Password",
                type: 'error'
            })
        }

        //find role in database (admin or user)
        const role = admin.role
        if (role !== 'admin') {
            return res.status(400).json({
                message: 'Access denied',
                type: 'error'
            })
        }

        // if admin correct credentials
        const token = createAuthToken(admin)
        
        console.log("Generate Token:", token);
        
        //set token in cookie
        setAuthCookie(res, token)
        
        return res.json({
            message: "Welcome Admin Dashboard",
            type: 'success',
            // token
        })

    } catch (err) {
        console.log("loginAdmin Controller Error:", err);
        
    }

}


module.exports = { submitSignupForm, loginAdmin }