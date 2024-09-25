const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configure the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

// Function to list all images in a bucket
const listImages = async (bucketName) => {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
    });
    const response = await s3Client.send(command);
    return response.Contents;
};

// Function to delete a specific image
const deleteImage = async (bucketName, key) => {
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    await s3Client.send(command);
    return { message: 'Image deleted successfully' };
};

module.exports = {
    listImages,
    deleteImage,
};
