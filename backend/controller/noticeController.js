const Notice = require("../models/notice");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadFolder = path.join(__dirname, '../uploads/notices');

// Ensure the folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}


// Add a new notice with file uploads
exports.addNotice = async (req, res) => {
    try {
        console.log("Hii hello coming add notie")
        const { title, description, date } = req.body;

        // Validate required fields
        if (!title || !description || !date) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and date are required fields"
            });
        }

        // Process file uploads if any
        const uploadedFiles = [];

        if (req.files && req.files.length > 0) {
            // Upload each file to Cloudinary
            for (const file of req.files) {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'notices',
                        resource_type: 'auto' // Auto-detect file type
                    });

                    // Add file info to uploadedFiles array
                    uploadedFiles.push({
                        originalname: file.originalname,
                        filename: path.basename(result.secure_url),
                        mimetype: file.mimetype,
                        size: file.size,
                        url: result.secure_url,
                        path: result.public_id
                    });

                    // Remove temporary file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error("Error uploading file to Cloudinary:", uploadError);
                }
            }
        }

        // Create new notice with uploaded files
        const newNotice = new Notice({
            title,
            description,
            date,
            files: uploadedFiles
        });
        console.log("dave", newNotice)
        // Save notice to database
        await newNotice.save();

        res.status(201).json({
            success: true,
            message: "Notice added successfully",
            data: newNotice
        });
    } catch (error) {
        console.error("Error adding notice:", error);
        res.status(500).json({
            success: false,
            message: "Error adding notice",
            error: error.message
        });
    }
};

// Get all notices
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: notices.length,
            data: notices
        });
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notices",
            error: error.message
        });
    }
};

// Get notice by ID
exports.getNoticeById = async (req, res) => {
    try {
        const { noticeId } = req.params;

        const notice = await Notice.findById(noticeId);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            data: notice
        });
    } catch (error) {
        console.error("Error fetching notice:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid notice ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error fetching notice",
            error: error.message
        });
    }
};

// Update notice
exports.updateNotice = async (req, res) => {
    try {
        const { noticeId } = req.params;
        const { title, description, date } = req.body;

        // Find the notice
        const notice = await Notice.findById(noticeId);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        // Update basic fields
        if (title) notice.title = title;
        if (description) notice.description = description;
        if (date) notice.date = date;

        // Process new file uploads if any
        if (req.files && req.files.length > 0) {
            const newUploadedFiles = [];

            // Upload each new file to Cloudinary
            for (const file of req.files) {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'notices',
                        resource_type: 'auto'
                    });

                    // Add file info to newUploadedFiles array
                    newUploadedFiles.push({
                        originalname: file.originalname,
                        filename: path.basename(result.secure_url),
                        mimetype: file.mimetype,
                        size: file.size,
                        url: result.secure_url,
                        path: result.public_id
                    });

                    // Remove temporary file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error("Error uploading file to Cloudinary:", uploadError);
                }
            }

            // Add new files to existing files
            notice.files = [...notice.files, ...newUploadedFiles];
        }

        // Save updated notice
        await notice.save();

        res.status(200).json({
            success: true,
            message: "Notice updated successfully",
            data: notice
        });
    } catch (error) {
        console.error("Error updating notice:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid notice ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating notice",
            error: error.message
        });
    }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
    try {
        const { noticeId } = req.params;

        // Find the notice
        const notice = await Notice.findById(noticeId);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        // Delete files from Cloudinary if they exist
        if (notice.files && notice.files.length > 0) {
            for (const file of notice.files) {
                if (file.path) {
                    try {
                        await cloudinary.uploader.destroy(file.path);
                    } catch (deleteError) {
                        console.error("Error deleting file from Cloudinary:", deleteError);
                    }
                }
            }
        }

        // Delete the notice from database
        await Notice.findByIdAndDelete(noticeId);

        res.status(200).json({
            success: true,
            message: "Notice deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting notice:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid notice ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error deleting notice",
            error: error.message
        });
    }
};

// Delete a specific file from a notice
exports.deleteFile = async (req, res) => {
    try {
        const { noticeId, fileId } = req.params;

        // Find the notice
        const notice = await Notice.findById(noticeId);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        // Find the file in the notice
        const fileIndex = notice.files.findIndex(file => file._id.toString() === fileId);

        if (fileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "File not found in notice"
            });
        }

        // Get the file to delete
        const fileToDelete = notice.files[fileIndex];

        // Delete file from Cloudinary
        if (fileToDelete.path) {
            try {
                await cloudinary.uploader.destroy(fileToDelete.path);
            } catch (deleteError) {
                console.error("Error deleting file from Cloudinary:", deleteError);
            }
        }

        // Remove file from notice
        notice.files.splice(fileIndex, 1);

        // Save updated notice
        await notice.save();

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
            data: notice
        });
    } catch (error) {
        console.error("Error deleting file:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error deleting file",
            error: error.message
        });
    }
};


