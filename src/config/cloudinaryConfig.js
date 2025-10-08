// Cloudinary Configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
};

// Debug: Log environment variables (remove in production)
console.log("Cloudinary Config:", {
  cloudName: cloudinaryConfig.cloudName,
  uploadPreset: cloudinaryConfig.uploadPreset,
  hasApiKey: !!cloudinaryConfig.apiKey,
});

// Cloudinary upload function
export const uploadImageToCloudinary = async (file) => {
  // Validate configuration
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    console.error("Cloudinary configuration missing:", cloudinaryConfig);
    return {
      success: false,
      error:
        "Cloudinary configuration is missing. Please check your environment variables.",
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("cloud_name", cloudinaryConfig.cloudName);

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    console.log("Uploading to:", uploadUrl);
    console.log("Upload preset:", cloudinaryConfig.uploadPreset);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload successful:", data);
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      data: data,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
