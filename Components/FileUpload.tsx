// src/components/FileUpload.tsx
"use client";

import React, { useState, useId } from "react";

interface FileUploadProps {
  label: string;
  accept?: string; // e.g., "image/*", ".pdf", "image/jpeg,image/png"
  maxSizeMB?: number; // max file size in MB
  required?: boolean;
  // onFileChange now emits the File object (for sending in FormData) and an optional preview string for UI
  onFileChange: (file?: File, preview?: string) => void;
  initialPreview?: string; // optional initial preview URL
  error?: string; // external error message
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "image/*",
  maxSizeMB = 5,
  required = false,
  onFileChange,
  initialPreview = "",
  error,
}) => {
  const [preview, setPreview] = useState<string>(initialPreview);
  const [fileError, setFileError] = useState<string>("");
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (!file) {
      setPreview("");
      onFileChange(undefined, "");
      return;
    }

    // Validate file type (basic match against MIME or extensions passed in accept)
    if (accept && !accept.split(",").some((type) => file.type.match(type.trim()) || (`.${file.name.split('.').pop()}` === type.trim()))) {
      setFileError(`Invalid file type. Accepted: ${accept}`);
      onFileChange(undefined, "");
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`File too large. Max size: ${maxSizeMB}MB`);
      onFileChange(undefined, "");
      return;
    }

    // Generate preview (for images & PDFs)
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      // Now emit the File object (for backend upload) and the preview for UI
      onFileChange(file, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Preview */}
      {preview && (
        <div className="mt-3">
          {preview.startsWith("data:image/") ? (
            <img src={preview} alt="Preview" className="max-w-xs max-h-64 rounded border" />
          ) : preview.startsWith("data:application/pdf") ? (
            <iframe src={preview} className="w-full h-96 border rounded" title="PDF Preview" />
          ) : (
            <p className="text-sm text-gray-600">File selected: {preview.slice(0, 50)}...</p>
          )}
        </div>
      )}

      {/* Errors */}
      {(fileError || error) && (
        <p className="text-red-600 text-sm">{fileError || error}</p>
      )}
    </div>
  );
};

export default FileUpload;