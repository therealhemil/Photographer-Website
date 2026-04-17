const { PortfolioQuery } = require("../models/portfolioModel")


const globalportfolioTitle = async(req, res, next)=>{
    try{
        const portfolio = await PortfolioQuery.findAll({attributes : ['id', 'title']})
        
        res.locals.portfolios = portfolio
        next()
    }catch (err){
        console.log("Header Portfolio Error:",err);
        next()
    }
}

module.exports = globalportfolioTitle