const { saveFilesAsjson } = require("../services/UploadServices")

// uploadFiles into server
const uploadImages = async (req, res)=>{
    try{
        const files = req.files

        console.log(files);
        

        if(!files) {
            return res.status(400).json({message : "No files Uploaded"})
        }

        const uploadingFiles = await saveFilesAsjson(files)

        res.status(200).json({message : "Files uploaded Successfully", files : uploadingFiles})
    } catch (err){
        console.log("Uploading Controller Error:", err);
        return res.status(500).json({err : "Error Uploading Error"})
        
    }
}

module.exports = {uploadImages}