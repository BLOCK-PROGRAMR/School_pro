const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the link collection'],
        trim: true
    }, branchId: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Branch',
        required: [true, 'Please provide a branch for the link collection']
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date for the link collection']
    },
    links: [
        {
            url: {
                type: String,
                required: [true, 'URL is required'],
                trim: true
            },
            description: {
                type: String,
                required: [true, 'Description is required'],
                trim: true
            }
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
linkSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Link', linkSchema);