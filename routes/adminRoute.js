const express = require('express')
const router = express.Router()

const {verifyAdmin} = require('../middleware/authMiddleware')
const pageController = require('../controller/pageController')
const { loginAdmin } = require('../controller/authController')
const { dashboard, deleteUser, updateUser } = require('../controller/adminController')
const { logoutSession } = require('../utils/jwt')


router.get("/admin", pageController.renderAdminLogin)
router.post("/admin-login-form",loginAdmin)
router.get("/admin/dashboard", verifyAdmin, dashboard)
router.put("/admin/users/:id", verifyAdmin, updateUser)
router.delete("/admin/users/:id", verifyAdmin, deleteUser)

router.post("/logout", verifyAdmin, logoutSession)


module.exports = router
