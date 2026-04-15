const express = require('express')
const router = express.Router()

const {verifyAdmin} = require('../middleware/authMiddleware')
const pageController = require('../controller/pageController')
const { loginAdmin } = require('../controller/authController')
const { dashboard, deleteUser, updateUser, UpdateContact, getInquiryTableData } = require('../controller/adminController')
const { logoutSession } = require('../utils/jwt')
const { upload } = require('../config/multerS3config')
const { uploadFiles, uploadImages } = require('../controller/uploadImagesController')


router.get("/admin", pageController.renderAdminLogin)
router.post("/admin-login-form",loginAdmin)
router.get("/admin/dashboard", verifyAdmin, dashboard)
router.put("/admin/users/:id", verifyAdmin, updateUser)
router.delete("/admin/users/:id", verifyAdmin, deleteUser)

router.post("/logout", verifyAdmin, logoutSession)

//Website Contact update
router.get("/admin/contactPage_Update", verifyAdmin, pageController.rendercontactPage_update)
router.post("/admin/update-contact", verifyAdmin, UpdateContact)

//Inquiry Table router
router.get("/admin/inquiry_Table", verifyAdmin, getInquiryTableData)
router.get("/admin/uploadImage", verifyAdmin, pageController.renderUploadImages)
router.post("/admin/upload-Image",verifyAdmin,upload.array("images", 5), uploadImages)

module.exports = router
