const express = require('express')

const pageController = require('../controller/pageController')

// routes
const router = express.Router()

router.get("/", pageController.renderHome)
router.get("/about_us", pageController.renderAbout_us)
router.get("/portfolio", pageController.renderPortfolio)
router.get("/portfolio_event_images", pageController.renderEventPortfolio)
router.get("/portfolio_animal_images", pageController.renderAnimalPortfolio)
router.get("/portfolio_wedding_images", pageController.renderWeddingPortfolio)
router.get("/portfolio_corporate_events", pageController.renderCorporatePortfolio)
router.get("/contact_us", pageController.renderContact_us)
router.get("/signup", pageController.renderSignup)
router.get("/login", pageController.renderlogin)

module.exports = router