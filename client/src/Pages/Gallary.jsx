import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch images from the backend
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/images'); // Ensure this URL matches your backend
      setImages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleDeleteImage = async (imageId) => {
    console.log(imageId);
    try {
      await axios.delete(`http://localhost:4000/user/images/${imageId}`);
      setShowModal(false);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]); // Ensure 'image' matches the multer setup

    try {
      const response = await axios.post('http://localhost:4000/user/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Image uploaded successfully:', response.data);
      fetchImages(); // Re-fetch images after upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
          Upload Image
          <input type="file" className="hidden" onChange={handleUploadImage} />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image._id} className="cursor-pointer" onClick={() => handleImageClick(image)}>
            <img src={image.s3Url} alt={image.title} className="w-full h-40 object-cover rounded shadow" />
          </div>
        ))}
      </div>

      {showModal && selectedImage && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="p-4 bg-white rounded shadow-lg max-w-lg w-full">
            <img src={selectedImage.s3Url} alt={selectedImage.title} className="w-full h-auto mb-4" />
            <button
              onClick={() => handleDeleteImage(selectedImage._id)}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Delete Image
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white py-2 px-4 ml-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
