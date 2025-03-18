const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add a new gallery with images
exports.addGallery = async (req, res) => {
    try {
        const { title, description, branchId } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        // Check if images are provided
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }
        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch is required"
            });
        }
        // Limit to 5 images
        if (req.files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images allowed per gallery"
            });
        }

        // Upload images to Cloudinary
        const uploadedImages = [];
        for (const file of req.files) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'gallery',
                    resource_type: 'image'
                });

                // Add image info to uploadedImages array
                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    originalname: file.originalname,
                    size: file.size
                });

                // Remove temporary file
                fs.unlinkSync(file.path);
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError);
                // Continue with other images even if one fails
            }
        }

        // Create new gallery with uploaded images
        const newGallery = new Gallery({
            title,
            branchId,
            description,
            images: uploadedImages
        });

        // Save gallery to database
        await newGallery.save();

        res.status(201).json({
            success: true,
            message: "Gallery created successfully",
            data: newGallery
        });
    } catch (error) {
        console.error("Error adding gallery:", error);
        res.status(500).json({
            success: false,
            message: "Error adding gallery",
            error: error.message
        });
    }
};

// Get all galleries
exports.getGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: galleries.length,
            data: galleries
        });
    } catch (error) {
        console.error("Error fetching galleries:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching galleries",
            error: error.message
        });
    }
};
exports.getGalleryByBranchId = async (req, res) => {
    try {
        const { branchId } = req.params;
        console.log("branchId", branchId)
        const galleries = await Gallery.find({ branchId });
        if (!galleries) {
            return res.status(404).json({
                success: false,
                message: "Gallery errror not found"
            });
        }
        res.status(200).json({
            success: true,
            count: galleries.length,
            data: galleries
        });

    }
    catch (error) {
        console.error("Error fetching galleries:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching galleries",
            error: error.message
        });
    }
}
// Get gallery by ID
exports.getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;

        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not happening"
            });
        }

        res.status(200).json({
            success: true,
            data: gallery
        });
    } catch (error) {
        console.error("Error fetching gallery:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error fetching gallery",
            error: error.message
        });
    }
};

// Delete gallery
exports.deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the gallery
        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not deleting"
            });
        }

        // Delete images from Cloudinary
        if (gallery.images && gallery.images.length > 0) {
            for (const image of gallery.images) {
                if (image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                    } catch (deleteError) {
                        console.error("Error deleting image from Cloudinary:", deleteError);
                        // Continue with other images even if one fails
                    }
                }
            }
        }

        // Delete the gallery from database
        await Gallery.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Gallery deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting gallery:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error deleting gallery",
            error: error.message
        });
    }
};

// Update gallery
exports.updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Find the gallery
        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not updating"
            });
        }

        // Update basic fields
        if (title) gallery.title = title;
        if (description !== undefined) gallery.description = description;

        // Process new image uploads if any
        if (req.files && req.files.length > 0) {
            // Check total images limit (existing + new <= 5)
            if (gallery.images.length + req.files.length > 5) {
                return res.status(400).json({
                    success: false,
                    message: `Maximum 5 images allowed per gallery. You already have ${gallery.images.length} images.`
                });
            }

            // Upload new images to Cloudinary
            for (const file of req.files) {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'gallery',
                        resource_type: 'image'
                    });

                    // Add image info to gallery.images array
                    gallery.images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                        originalname: file.originalname,
                        size: file.size
                    });

                    // Remove temporary file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error("Error uploading image to Cloudinary:", uploadError);
                    // Continue with other images even if one fails
                }
            }
        }

        // Save updated gallery
        await gallery.save();

        res.status(200).json({
            success: true,
            message: "Gallery updated successfully",
            data: gallery
        });
    } catch (error) {
        console.error("Error updating gallery:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating gallery",
            error: error.message
        });
    }
};

// Delete a specific image from a gallery
exports.deleteImage = async (req, res) => {
    try {
        const { galleryId, imageId } = req.params;

        // Find the gallery
        const gallery = await Gallery.findById(galleryId);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not delete"
            });
        }

        // Find the image in the gallery
        const imageIndex = gallery.images.findIndex(image => image._id.toString() === imageId);

        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Image not found in gallery"
            });
        }

        // Get the image to delete
        const imageToDelete = gallery.images[imageIndex];

        // Delete image from Cloudinary
        if (imageToDelete.public_id) {
            try {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
            }
        }

        // Remove image from gallery
        gallery.images.splice(imageIndex, 1);

        // Save updated gallery
        await gallery.save();

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            data: gallery
        });
    } catch (error) {
        console.error("Error deleting image:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error deleting image",
            error: error.message
        });
    }
};