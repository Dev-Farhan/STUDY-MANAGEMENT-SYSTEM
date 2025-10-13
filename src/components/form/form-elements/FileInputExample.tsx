import React from "react";
import FileInput from "../input/FileInput";

interface DynamicFileUploaderProps {
  onFileSelect: (file: File | null) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  existingFile?: { name?: string; url?: string };
  file?: File | null;
  setFile?: (file: File | null) => void;
}

const DynamicFileUploader: React.FC<DynamicFileUploaderProps> = ({
  onFileSelect,
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ],
  maxSizeMB = 10,
  existingFile,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("❌ Invalid file type!");
      e.target.value = "";
      return;
    }

    if (selectedFile.size / (1024 * 1024) > maxSizeMB) {
      alert(`⚠️ File too large! Max ${maxSizeMB} MB allowed.`);
      e.target.value = "";
      return;
    }

    onFileSelect(selectedFile);
  };

  const isImage =
    existingFile?.url &&
    (existingFile.url.endsWith(".jpg") ||
      existingFile.url.endsWith(".jpeg") ||
      existingFile.url.endsWith(".png"));

  return (
    <div className="flex flex-col gap-3">
      {/* ✅ Show existing image preview */}
      {existingFile?.url && (
        <div className="relative w-40 h-40 border rounded-lg overflow-hidden shadow-sm">
          {isImage ? (
            <img
              src={existingFile.url}
              alt="Existing file"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-sm text-gray-600">
              📄 {existingFile.name || "Existing File"}
            </div>
          )}
        </div>
      )}

      {/* ✅ File input for uploading a new one */}
      <FileInput onChange={handleFileChange} />
    </div>
  );
};

export default DynamicFileUploader;
