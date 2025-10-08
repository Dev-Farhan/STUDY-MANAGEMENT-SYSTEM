import React, { useState } from "react";

interface ImageCellProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fallbackText?: string;
  clickable?: boolean;
  onClick?: () => void;
}

const ImageCell: React.FC<ImageCellProps> = ({
  src,
  alt = "Image",
  className = "",
  size = "md",
  fallbackText = "No Image",
  clickable = false,
  onClick,
}) => {
  console.log("qqqqqqqqqqqqqqqqqqqqqqqqq", src);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleClick = () => {
    if (clickable && onClick && src && !imageError) {
      onClick();
    }
  };

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600`}
      >
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${
        sizeClasses[size]
      } ${className} relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 ${
        clickable
          ? "cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
          : ""
      }`}
      onClick={handleClick}
    >
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      {clickable && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ImageCell;
