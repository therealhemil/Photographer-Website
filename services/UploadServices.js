const { PortfolioQuery } = require("../models/portfolioModel")

const generateFileUrl = (files) =>{
 return files.map(file =>{
    return `${process.env.CLOUDFRONT_URL}/${file.key}`
 })
}

//save files as json
const saveFilesAsjson = async (files) =>{
        
        const fileUrls = generateFileUrl(files) 

        const savedinDB = await PortfolioQuery.create({
            files : fileUrls
        })

        return savedinDB    
}

module.exports = {saveFilesAsjson}
