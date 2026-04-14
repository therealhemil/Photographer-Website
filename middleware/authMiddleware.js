const jwt = require('jsonwebtoken')


const verifyAdmin = (req, res, next) => {
    
    // console.log("Cookie:", req.cookies);
    const token = req.cookies.token

    if (!token) {

        return res.redirect("/admin")
        // return res.status(401).json({
        //     message: "Unauthorized access Denied",
        //     type: 'error'
        // })
    }

    try {

        // const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(decoded.role !== 'admin') return res.json({message : "Unauthorizes Access", type : "error"}) 
        req.user = decoded
        next()
    } catch (err) {
        return res.redirect("/admin")
        // res.status(401).json({
        //     message: "Invalid Token"
        // })
    }


}

module.exports = { verifyAdmin }