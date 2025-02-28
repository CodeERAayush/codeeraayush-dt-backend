const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware for uploading multiple photos
const uploadPhotos = async (req, res, next) => {
  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      next();
    }


    if (req.files.length > 3) {
      return res.status(400).json({ error: 'Maximum 3 files allowed' });
    }

    const uploadPromises = req.files.map(async (file) => {

      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'images',
        resource_type: 'auto'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    console.log("file: ",uploadedFiles)
    console.log(uploadedFiles.map(item=>item?.url))

    req.body.photoUrl = uploadedFiles.map(item=>item?.url);

    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error uploading files',
      details: error.message 
    });
  }
};

// Export the middleware
module.exports = {
  uploadMultiple: upload.array('photos', 3),
  processUploads: uploadPhotos
};