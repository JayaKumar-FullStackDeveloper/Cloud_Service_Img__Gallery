// src/models/File.js

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,  // Make fileName required
    },
    s3Url: {
        type: String,
        required: true,  // Make s3Url required
    },
    uploadDate: {
        type: Date,
        default: Date.now, // Automatically set the upload date to now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to a User model if you have one
    },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
