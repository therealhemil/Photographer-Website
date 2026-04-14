const { contactMessageQuery } = require("../models/contactModel")
const { Subscribe_emailQuery } = require('../models/subscribe_emailModel')
const { contactPageQuery } = require('../models/contactPageModel');

// Contact From submit
const SubmitContactForm = async (req, res) => {
    const { name, email, phone, msg } = req.body
    console.log(req.body);

    try {
        if (!name || !email || !msg || !phone) {
            return res.status(400).json({
                message: "All fields Required",
                type: "error"
            })
        }
        await contactMessageQuery.create({ name, email, phone, message: msg })
        return res.json({ message: "Form Submit Successfully", type: "success" })
    } catch (err) {
        console.log("Contact Form Error:", err);
        return res.json({ message: "Server Error", type: "error" })
    }
}

// Subscribe_email Submit
const Subscribe_email = async (req, res) => {
    const { email } = req.body
    console.log(req.body);

    //check is email already in data
    const emailExist = await Subscribe_emailQuery.findOne({ email })
    if (emailExist) {
        return res.json({
            message: "Email Already Subscribed!",
            type: 'error'
        })
    }

    try {
        await Subscribe_emailQuery.create({ email })
        return res.json({
            message: "Subscribed Succesfully",
            type: 'success'
        })
    } catch (err) {
        console.log("Subscribe Email Error:", err);
        return res.json({
            message: "Server Errror",
            type: 'error'
        })


    }
}


module.exports = { SubmitContactForm, Subscribe_email }