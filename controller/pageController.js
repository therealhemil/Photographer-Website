const { contactPage_Rener } = require("./adminController")

const renderView = (viewName, locals = {}) => (req, res) => {
    res.render(viewName, locals)
}

module.exports = {
    renderHome: renderView("pages/Home_page"),
    renderAbout_us: renderView("pages/About_us_page"),
    renderPortfolio: renderView("pages/Portfolio_page"),
    renderAnimalPortfolio: renderView("pages/portfolio_page/Animal_images"),
    renderCorporatePortfolio: renderView("pages/portfolio_page/Corporate_events"),
    renderEventPortfolio: renderView("pages/portfolio_page/Event_images"),
    renderWeddingPortfolio: renderView("pages/portfolio_page/Wedding_images"),
    // renderContact_us: renderView("pages/Contact_us_page"),
    renderSignup: renderView("pages/authpages/signup_page", { message: "", type: "" }),
    renderlogin: renderView("pages/authpages/login_page", { message: "", type: "" }),
    renderAdminLogin: renderView("pages/authpages/admin_login_page", { message: "", type: "" }),
    rendercontactPage_update : renderView("contactPage_Update")
}