import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadProfilePicture } from "../services/userService";

const ProfileImageUploader = ({ userId, currentImage, onUploadSuccess }) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const fullCurrentImage =
    currentImage && currentImage.startsWith("/")
      ? `${apiUrl}${currentImage}`
      : currentImage;
  const [preview, setPreview] = useState(fullCurrentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const maxWidth = 800;
          const maxHeight = 800;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.85
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  // Validate file
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, and WebP images are allowed");
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 3MB");
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    try {
      setError("");
      validateFile(file);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Compress and upload
      setUploading(true);
      const compressedFile = await compressImage(file);
      const response = await uploadProfilePicture(userId, compressedFile);

      if (response.success) {
        const fullImageUrl = `http://localhost:5000${response.imageUrl}`;
        setPreview(fullImageUrl);
        onUploadSuccess(fullImageUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full">
      {/* Preview */}
      <div className="flex justify-center mb-6">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-500 ring-offset-4 shadow-2xl">
            <img
              src={preview || fullCurrentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {uploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Drag & Drop Zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-gray-200  scale-105"
            : "border-primary-600 bg-primary-600/10 hover:border-gray-200"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          {/* Icon */}
          <motion.div
            animate={isDragging ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: isDragging ? Infinity : 0, duration: 1 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl shadow-lg">
              📸
            </div>
          </motion.div>

          {/* Text */}
          <div>
            <p className="text-white font-semibold text-lg mb-2">
              {isDragging ? "Drop image here" : "Upload Profile Picture"}
            </p>
            <p className="text-gray-400 text-sm">
              Drag & drop or click to choose
            </p>
            <p className="text-gray-500 text-xs mt-2">
              JPG, PNG, WebP • Max 3MB
            </p>
          </div>

          {/* Button */}
          {!isDragging && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:opacity-80 text-white font-medium rounded-xl shadow-lg transition-colors"
              disabled={uploading}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Choose File
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
        >
          <p className="text-primary-400 text-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
            Uploading and compressing image...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
