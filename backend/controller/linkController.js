const Link = require('../models/Link');

// Add a new link collection
exports.addLinkCollection = async (req, res) => {
    try {
        const { title, date, links } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        if (!links || !Array.isArray(links) || links.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one link is required"
            });
        }

        // Validate each link
        for (const link of links) {
            if (!link.url) {
                return res.status(400).json({
                    success: false,
                    message: "URL is required for each link"
                });
            }

            if (!link.description) {
                return res.status(400).json({
                    success: false,
                    message: "Description is required for each link"
                });
            }

            // Validate URL format
            try {
                new URL(link.url);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid URL format: ${link.url}`
                });
            }
        }

        // Create new link collection
        const newLinkCollection = new Link({
            title,
            date,
            links
        });

        // Save to database
        await newLinkCollection.save();

        res.status(201).json({
            success: true,
            message: "Link collection created successfully",
            data: newLinkCollection
        });
    } catch (error) {
        console.error("Error adding link collection:", error);
        res.status(500).json({
            success: false,
            message: "Error adding link collection",
            error: error.message
        });
    }
};

// Get all link collections
exports.getLinkCollections = async (req, res) => {
    try {
        const linkCollections = await Link.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: linkCollections.length,
            data: linkCollections
        });
    } catch (error) {
        console.error("Error fetching link collections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching link collections",
            error: error.message
        });
    }
};

// Get link collection by ID
exports.getLinkCollectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const linkCollection = await Link.findById(id);

        if (!linkCollection) {
            return res.status(404).json({
                success: false,
                message: "Link collection not found"
            });
        }

        res.status(200).json({
            success: true,
            data: linkCollection
        });
    } catch (error) {
        console.error("Error fetching link collection:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid link collection ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error fetching link collection",
            error: error.message
        });
    }
};

// Update link collection
exports.updateLinkCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, links } = req.body;

        // Find the link collection
        const linkCollection = await Link.findById(id);

        if (!linkCollection) {
            return res.status(404).json({
                success: false,
                message: "Link collection not found"
            });
        }

        // Update fields if provided
        if (title) linkCollection.title = title;
        if (date) linkCollection.date = date;

        if (links && Array.isArray(links) && links.length > 0) {
            // Validate each link
            for (const link of links) {
                if (!link.url) {
                    return res.status(400).json({
                        success: false,
                        message: "URL is required for each link"
                    });
                }

                if (!link.description) {
                    return res.status(400).json({
                        success: false,
                        message: "Description is required for each link"
                    });
                }

                // Validate URL format
                try {
                    new URL(link.url);
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid URL format: ${link.url}`
                    });
                }
            }

            linkCollection.links = links;
        }

        // Save updated link collection
        await linkCollection.save();

        res.status(200).json({
            success: true,
            message: "Link collection updated successfully",
            data: linkCollection
        });
    } catch (error) {
        console.error("Error updating link collection:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid link collection ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating link collection",
            error: error.message
        });
    }
};

// Delete link collection
exports.deleteLinkCollection = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the link collection
        const deletedLinkCollection = await Link.findByIdAndDelete(id);

        if (!deletedLinkCollection) {
            return res.status(404).json({
                success: false,
                message: "Link collection not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Link collection deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting link collection:", error);

        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid link collection ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error deleting link collection",
            error: error.message
        });
    }
};

// Get link collections by date range
exports.getLinkCollectionsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        // Create date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Set end date to end of day
        end.setHours(23, 59, 59, 999);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }

        // Find link collections within date range
        const linkCollections = await Link.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: linkCollections.length,
            data: linkCollections
        });
    } catch (error) {
        console.error("Error fetching link collections by date range:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching link collections by date range",
            error: error.message
        });
    }
};