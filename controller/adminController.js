const { contactPageQuery } = require("../models/contactPageModel")
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


const contactPage_Rener = async(req,res) =>{
    try{
        //get single contact record
        let contact = await contactPageQuery.findOne()

        //if no data in DB, prevent crash
        if(!contact){
            contact = {
                address : "",
                phone_number: "",
                email: ""
            }
        }       
    res.render("pages/Contact_us_page", {contact}) 

    }catch (err){
        console.log("Contact DB Error:",err)
        res.render("pages/Contact_us_page", {
            contact :{}
        })
    }
}

const UpdateContact = async(req, res) =>{

    console.log("API Hitting");
    
    try{
        const {address, phone_number, email} = req.body
        
        //let check if record exists
        let contact = await contactPageQuery.findOne()

        if(contact){
            await contact.update({
                address,
                phone_number,
                email
            })
        }else {
            // create new entry
            contact = await contactPageQuery.create({
                address,
                phone_number,
                email
            })
        }

        res.json({
            message : "Contact Updated Successfully",
            type : "success"
        })

    }catch (err){
        console.log(err);
        res.status(500).json({
            message : "Update Failed",
            type : "error"
        })
        
    }
}


module.exports = { dashboard, deleteUser, updateUser, contactPage_Rener, UpdateContact }