import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';

// @desc    Upload image to cloudinary
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  try {
    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    const fileType = req.file.mimetype;
    const dataURI = `data:${fileType};base64,${fileStr}`;
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'starry-comics',
    });
    
    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500);
    throw new Error('Image upload failed');
  }
});

export { uploadImage };
