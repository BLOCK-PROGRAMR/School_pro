const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the gallery'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        Ref: 'Branch'
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            },
            originalname: String,
            size: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
gallerySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Gallery', gallerySchema);