const { PortfolioQuery } = require("../models/portfolioModel")
const { contactPage_Rener } = require("./adminController")

const renderView = (viewName, locals = {}) => (req, res) => {
    res.render(viewName, locals)
}


// Dynamically chnage portfolio image from server
const DynamicallygetPortFolioImages = async (req, res) => {
    const portfolios = await PortfolioQuery.findAll({
        order: [["id", "ASC"]]
    })

    res.render("pages/Portfolio_page", { portfolios })
}


// get portfolio_images explore more
const getportfolioExploreImages =  async (req, res) =>{

    try{

        const {id } = req.params

        const portfolio = await PortfolioQuery.findByPk(id)

        if(!portfolio) {
            return res.status(404).send("Portfolio not found")
        }

        res.render("layouts/portfolioImageTemp", { portfolio})

    } catch (err){
        console.log("Portfolio Image error:", err);
        res.status(500).send("Server Error")
    }
}





module.exports = {
    renderHome: renderView("pages/Home_page"),
    renderAbout_us: renderView("pages/About_us_page"),
    // renderPortfolio: renderView("pages/Portfolio_page"),
    // renderAnimalPortfolio: renderView("pages/portfolio_page/Animal_images"),
    // renderCorporatePortfolio: renderView("pages/portfolio_page/Corporate_events"),
    // renderEventPortfolio: renderView("pages/portfolio_page/Event_images"),
    // renderWeddingPortfolio: renderView("pages/portfolio_page/Wedding_images"),
    // renderContact_us: renderView("pages/Contact_us_page"),
    renderSignup: renderView("pages/authpages/signup_page", { message: "", type: "" }),
    renderlogin: renderView("pages/authpages/login_page", { message: "", type: "" }),
    renderAdminLogin: renderView("pages/authpages/admin_login_page", { message: "", type: "" }),
    rendercontactPage_update : renderView("contactPage_Update"),
    // renderInquiryTable : renderView("Inquiry_Table")
    // renderUploadImages : renderView("uploadImages")
    DynamicallygetPortFolioImages,
    getportfolioExploreImages,
    renderChat_section : renderView("layouts/admin_chat_section")
}   