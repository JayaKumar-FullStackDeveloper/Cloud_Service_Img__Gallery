const multer = require('multer');

// Use memory storage to keep files in memory
const storage = multer.memoryStorage();

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    // Accept files only if they are images
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true); // Accept the file
};

// Initialize upload with no size limits and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single('image'); // Field name for the file

module.exports = upload;
