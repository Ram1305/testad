export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
};

// Initialize Cloudinary
export const initCloudinary = () => {
  if (typeof window !== 'undefined' && (window as any).cloudinary) {
    (window as any).cloudinary.setCloudName(cloudinaryConfig.cloudName);
  }
};
