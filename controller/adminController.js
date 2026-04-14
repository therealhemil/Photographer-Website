const { UserQuery } = require("../models/UserModel")

const dashboard = async (req, res) => {
    const users = await UserQuery.findAll()

    totalUsers = await UserQuery.count()
    maleUsers = await UserQuery.count({ where: { gender: "male" } })
    femaleUsers = await UserQuery.count({ where: { gender: 'female' } })
    otherUsers = totalUsers - maleUsers - femaleUsers



    res.render("admin_dashboard", {
        users,
        stats: {
            totalUsers,
            maleUsers,
            femaleUsers,
            otherUsers
        },
        primaryColumn: 'id'
    })

}


const deleteUser = async (req, res) => {
    try {

        const { id } = req.params

        const user = await UserQuery.findByPk(id)

        if(!user){
            res.status(404).json({
                message : "User not found!",
                type: "error"
            })
        }

        await user.destroy()

        return res.json({
            message : "User Deleted Successfully", 
            type: "success"
        })
    } catch (err){
        console.log(err);
        res.status(500).json({message : "Server Error", type: "error"})
        
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { first_name, last_name, gender } = req.body

        const user = await UserQuery.findByPk(id)

        if (!user) {
            return res.status(404).json({ message: 'User not found!', type : "error" })
        }

        // update Fields
        user.first_name = first_name
        user.last_name = last_name
        user.gender = gender

        await user.save()

        return res.json({
            message: "User Updated Successfully",
            type : "sucess",
            user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error', type : 'error' })

    }
}

module.exports = { dashboard, deleteUser, updateUser }