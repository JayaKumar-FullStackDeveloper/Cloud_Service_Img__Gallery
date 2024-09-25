const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  signin,
  forgotpassword,
  resetpassword,
  resendOTP,
  getUserDetails,
  getAllUsers,
  deleteUser,
  updateUserById
} = require('../controllers/userController');
const { protectUser } = require('../middleware/userMiddleware');
const upload = require('../middleware/s3UploadsMiddleware');
const { uploadFileToS3, getAllImages, deleteSpecificImage } = require('../controllers/galleryController');

// Upload route
router.post('/upload', upload, uploadFileToS3);
// Route to get all images
router.get('/images', getAllImages);

// Route to delete a specific image
router.delete('/images/:key', deleteSpecificImage);


// Route to register a new user
router.post('/usercreate', registerUser);

// Route to verify OTP for user registration
router.post('/verify-otp', verifyOTP);

// Route to sign in a user
router.post('/signin', signin);

// Route to handle forgot password requests
router.post('/forgot-password', forgotpassword);

// Route to reset the password
router.post('/reset-password/:token', resetpassword);

// Route to resend OTP to the user’s email
router.post('/resend-otp', resendOTP);
router.get('/getAllUser', getAllUsers);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUserById);

router.get('/me', protectUser, getUserDetails); // Protect this route with middleware



module.exports = router;
