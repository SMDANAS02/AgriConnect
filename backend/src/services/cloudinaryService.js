const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer from Multer
 * @param {string} folder - Target Cloudinary folder
 * @returns {Promise<{url: string, public_id: string, width: number, height: number}>}
 */
const uploadImage = async (fileBuffer, folder = 'agriconnect') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are not fully configured, return a mock placeholder for dev fallback
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️ Cloudinary keys not set, returning placeholder image URL');
      return resolve({
        url: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800',
        public_id: `agriconnect/mock_${Date.now()}`,
        width: 800,
        height: 600
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadImage
};
