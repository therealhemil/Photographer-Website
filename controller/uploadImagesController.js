const { PortfolioQuery } = require("../models/portfolioModel")
const { saveFilesAsjson } = require("../services/UploadServices")


// add title into database
const addTitle = async (req, res) => {
    const { title } = req.body

    //check title
    console.log(title);

    try {

        const titleFind = await PortfolioQuery.findOne({ where: { title } })

        if (titleFind) {
            res.json({ message: "Title is Already in List.", type: "error" })
        } else {
            await PortfolioQuery.create({ title })
            res.status(200).json({ message: "Add Title Succesfully", type: "sucess" })
        }



    } catch (err) {
        console.log("addding tittle error", err);
        res.status(500).json({ message: "Server Error" })
    }


}


// get portfolio in webpage
const getPortFolio = async (req, res) => {
    const portfolios = await PortfolioQuery.findAll({
        order: [["id", "ASC"]]
    })

    res.render("uploadImages", { portfolios })
}



// uploadimages into server
const uploadImages = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(404).json({ message: "invalid request" });
        }

        const files = req.files

        console.log(files);

        if (!files[0]) {
            return res.status(400).json({ message: "No files Uploaded" })
        }

        const uploadingFiles = await saveFilesAsjson(id, files)

        res.status(200).json({ message: "Files uploaded Successfully", files: uploadingFiles })
    } catch (err) {
        console.log("Uploading Controller Error:", err);
        return res.status(500).json({ err: "Error Uploading Error" })

    }
}

//delete images
const deleteImages = async (req, res) => {
    const { id } = req.params
    const { imageUrl } = req.body

    console.log("ImageURL form body", imageUrl);


    try {
        const portfolio = await PortfolioQuery.findByPk(id)

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio Title not found" })
        }

        let images = portfolio.images || []

        console.log("Image Data fetch for server:", images);
        console.log("Image Data type:", typeof images);
        

        // remove image
        images = images.filter(i => {
            if (!i) return false
            return i !== imageUrl
        })

        console.log("Deleting in Database", images);


        await portfolio.update({ images })

        res.json({ message: "Image Deleted Successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" })
    }

}


module.exports = { uploadImages, getPortFolio, addTitle, deleteImages }