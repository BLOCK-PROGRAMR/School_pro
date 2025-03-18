const express = require('express');
const router = express.Router();
const galleryController = require('../controller/galleryController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.post('/', upload.array('images', 5), galleryController.addGallery);
router.get('/', galleryController.getGalleries);
router.get('/:id', galleryController.getGalleryById);
router.put('/:id', upload.array('images', 5), galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);
router.delete('/:galleryId/images/:imageId', galleryController.deleteImage);
router.get('/branch/:branchId', galleryController.getGalleryByBranchId);

module.exports = router;