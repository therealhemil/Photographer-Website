const multer = require("multer");
const { s3 } = require("./s3config");
const multerS3 = require("multer-s3")

// multer config for uploading image in to AWS backet
const upload = multer({
    storage : multerS3({
        s3 : s3,
        bucket: (req, file, cb) =>{
            cb(null, process.env.S3_BUCKET_NAME)
        },
        metadata : (req,file,cb) =>{
            cb(null, {fieldName : file.fieldname})
        },
        key : (req,file, cb)=>{
            cb(null, `uploads/${Date.now()}.${file.originalname.split(".")[1]}`)
        }
    })
})

module.exports = {upload}