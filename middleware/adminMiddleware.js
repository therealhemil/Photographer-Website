// check user is admin

const isAdmin = (req,res,next)=>{
    
    if (req.user.role !== 'admin') {
        return res.redirect('/admin',{message : 'Admin access only'})
        // return res.status(403).json({
            // message: 'Admin access only'
    }

    next()
}

module.exports = {isAdmin}