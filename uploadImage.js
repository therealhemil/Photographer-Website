require("dotenv").config();
const { S3Client }  = require("@aws-sdk/client-s3");
const { Router } = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3')

const uploadRouter = Router();

// Configure AWS SDK
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION
});

// Configure Multer for file uploads
// const storage = multer.memoryStorage();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: (req, file, cb) => {
        cb(null, process.env.S3_BUCKET_NAME);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}.${file.originalname.split('.')[1]}`);
    },
  }),
});


// API Route for Uploading Images
uploadRouter.post("/uploadImage", upload.array('images', 5), async (req, res) => {
    try {
        const files = req.files;

        console.log("File content", files);
        
        if (!files[0]) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Generate a unique file name

        const uploadedFiles = files.map(file => {
            // If you have a custom CloudFront URL, use the key to build it
            return `${process.env.CLOUDFRONT_URL}/${file.key}`;
        });

    
        console.log("Uploaded files url", uploadedFiles);

        res.json({
            message: "Upload successful",
            fileURL: uploadedFiles
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Error uploading file" });
    }
});

module.exports = uploadRouter;