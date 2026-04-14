// for route use always call express first.
const express = require('express')

const enagagementController = require("../controller/enagagementController")
const authController = require("../controller/authController")

const router = express.Router()

router.post("/contact-form", enagagementController.SubmitContactForm)
router.post("/subscribe-email",enagagementController.Subscribe_email)
router.post("/signup-form",authController.submitSignupForm)
router.post("/admin-login-form", authController.loginAdmin)


module.exports = router

