import React, { useState, useEffect } from 'react';
import { cloudinaryConfig } from '../config/cloudinary';
import { VideoItem } from '../services/storage';
import './CloudinaryUpload.css';

interface CloudinaryUploadProps {
  onUploadComplete: (video: VideoItem) => void;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSuccess = (result: any) => {
    if (result && result.event === 'success') {
      const videoItem: VideoItem = {
        id: result.info.public_id,
        title: result.info.original_filename || 'Uploaded Video',
        url: result.info.secure_url,
        thumbnail: result.info.thumbnail_url,
        duration: result.info.duration,
        cloudinaryId: result.info.public_id,
      };
      onUploadComplete(videoItem);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    // Initialize Cloudinary when component mounts
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      (window as any).cloudinary.setCloudName(cloudinaryConfig.cloudName);
    }
  }, []);

  const openWidget = () => {
    if (!(window as any).cloudinary) {
      alert('Cloudinary script not loaded. Please check your internet connection and Cloudinary configuration.');
      return;
    }

    setIsUploading(true);
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        multiple: false,
        maxFileSize: 100000000, // 100MB
        showAdvancedOptions: false,
        cropping: false,
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Upload error:', error);
          setIsUploading(false);
          setUploadProgress(0);
          alert('Upload failed. Please check your Cloudinary configuration.');
        } else if (result && result.event) {
          if (result.event === 'success') {
            handleSuccess(result);
          } else if (result.event === 'close') {
            setIsUploading(false);
            setUploadProgress(0);
          }
        }
      }
    );
    widget.open();
  };

  return (
    <div className="cloudinary-upload">
      <button
        className="upload-btn"
        onClick={openWidget}
        disabled={isUploading}
        aria-label="Upload video from Cloudinary"
      >
        {isUploading ? (
          <>
            <span className="upload-spinner">⏳</span>
            Uploading... {Math.round(uploadProgress * 100)}%
          </>
        ) : (
          <>
            <span>☁️</span>
            Upload Video from Cloudinary
          </>
        )}
      </button>

      <div className="upload-info">
        <p className="info-text">
          Configure your Cloudinary credentials in <code>.env</code> file:
        </p>
        <code className="config-code">
          VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name<br />
          VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset<br />
          VITE_CLOUDINARY_API_KEY=your-api-key
        </code>
      </div>

      {/* Cloudinary script is loaded in index.html */}
    </div>
  );
};
