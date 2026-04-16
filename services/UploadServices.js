const { PortfolioQuery } = require("../models/portfolioModel")

const generateFileUrl = (files) => {
    return files.map(file => {
        return `https://${process.env.CLOUDFRONT_URL}/${file.key}`
    })
}

//save files as json
const saveFilesAsjson = async (id, files) => {

    console.log("Files before maping to cloudfront url:", id, files);

    const fileUrls = generateFileUrl(files)

    console.log("File urls", fileUrls);

    await PortfolioQuery.findOne({ where: { id : id }}).then(( async data => {

        console.log("Data", data, data.title);
        var portfolio = data;
        
        console.log("portfolio",portfolio);

        let newFileUrls = [];
        
        if(portfolio && portfolio.images && portfolio.images.length) {
            newFileUrls = portfolio.images;
            fileUrls.forEach(url => newFileUrls.push(url));
        } else {
            newFileUrls = fileUrls;
        }

        let inserted = await PortfolioQuery.update(
            { images: newFileUrls },
            { where: { id: id } }   
        )

        return inserted;
    }))
}

module.exports = { saveFilesAsjson }
