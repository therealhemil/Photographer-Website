const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// console.log(JWT_SECRET_KEY)

// generate Token 
const createAuthToken = (admin) => {
    return jwt.sign({
        id: admin.id,
        role: admin.role
    }, JWT_SECRET_KEY, { expiresIn: "1d"})
}


// set token into cookie
const setAuthCookie = (res, token) => {
    return res.cookie('token', token, {
        httpOnly: true,
        // secure: false,
        // path: "/",
        // sameSite: "Strict"
    })
}

//clear cookie when admin/user logout
const logoutSession = (req,res) =>{
    res.clearCookie("token", {
        httpOnly : true,
        // secure : false,
    })

    return res.json({success: true, message : "Logout Successfully", type : "success"})
}



module.exports = { createAuthToken, setAuthCookie, logoutSession }