const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/awsConfig');
const File = require('../models/galleryModels'); // Import the File model
const { listImages, deleteImage } = require('../utils/s3Service');

const uploadFileToS3 = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME, // Set this in your .env
      Key: `uploads/${req.file.originalname}`, // Adjust path as necessary
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    },
  });

  try {
    await upload.done(); // Wait for the upload to complete

    // Save file metadata to MongoDB
    const newFile = new File({
      fileName: req.file.originalname,
      s3Url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/uploads/${req.file.originalname}`, // Update the URL accordingly
      uploadedBy: req.user ? req.user._id : null, // Assuming req.user contains user information
    });

    await newFile.save(); // Save the file metadata to the database

    res.status(201).json({ message: 'File uploaded successfully!', file: newFile });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};

const getAllImages = async (req, res) => {
  try {
    const imagesFromDB = await File.find({}); 
    res.status(200).json(imagesFromDB);
  } catch (error) {
    console.error("Error fetching images from MongoDB:", error);
    res.status(500).json({ message: 'Error fetching images', error });
  }
};

// Delete specific image
const deleteSpecificImage = async (req, res) => {
  const id  = req.params; // Ensure you're capturing the ID correctly
  console.log(`Attempting to delete image with ID: ${id.key}`);
  try {
    const imageDoc = await File.findById({_id: id.key});
    if (!imageDoc) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Call the existing deleteImage service to delete from S3
    await deleteImage(process.env.S3_BUCKET_NAME, imageDoc.fileName); // Ensure this is the correct key

    // Delete the image document from MongoDB
    await File.deleteOne({_id: id.key});

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: 'Error deleting image', error });
  }
};


module.exports = { uploadFileToS3, getAllImages, deleteSpecificImage };
