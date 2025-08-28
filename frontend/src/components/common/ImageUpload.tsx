'use client';

import Image from 'next/image';
import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react';

export interface ImageMetadata {
  originalName: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  thumbnails?: Array<{
    filename: string;
    path: string;
    url: string;
    dimensions: { width: number; height: number };
    suffix: string;
  }>;
}

interface ImageUploadProps {
  onImagesUploaded?: (images: ImageMetadata[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFormats?: string[];
  showPreview?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  previewClassName?: string;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function ImageUpload({
  onImagesUploaded,
  onError,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  showPreview = true,
  multiple = true,
  disabled = false,
  className = '',
  previewClassName = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        // Check file type
        if (!acceptedFormats.includes(file.type)) {
          errors.push(
            `${file.name}: Invalid file type. Accepted: ${acceptedFormats.join(
              ', '
            )}`
          );
          continue;
        }

        // Check file size
        if (file.size > maxFileSize) {
          errors.push(
            `${file.name}: File too large (${(file.size / 1024 / 1024).toFixed(
              2
            )}MB). Max: ${maxFileSize / 1024 / 1024}MB`
          );
          continue;
        }

        validFiles.push(file);
      }

      // Check total file count
      if (selectedFiles.length + validFiles.length > maxFiles) {
        errors.push(
          `Too many files selected. Maximum ${maxFiles} files allowed.`
        );
        return [];
      }

      if (errors.length > 0 && onError) {
        onError(errors.join('\n'));
      }

      return validFiles;
    },
    [acceptedFormats, maxFileSize, maxFiles, selectedFiles.length, onError]
  );

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const validFiles = validateFiles(event.target.files);
      if (validFiles.length > 0) {
        setSelectedFiles((prev) =>
          multiple ? [...prev, ...validFiles] : validFiles
        );
      }

      // Reset input
      event.target.value = '';
    },
    [validateFiles, multiple]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = event.dataTransfer.files;
      if (files.length === 0) return;

      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        setSelectedFiles((prev) =>
          multiple ? [...prev, ...validFiles] : validFiles
        );
      }
    },
    [validateFiles, multiple, disabled]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const uploadImages = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress([]);

    const uploadResults: ImageMetadata[] = [];
    const errors: string[] = [];

    try {
      if (multiple && selectedFiles.length > 1) {
        // Upload multiple images
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          formData.append('images', file);
        });

        // Initialize progress
        const initialProgress: UploadProgress[] = selectedFiles.map((file) => ({
          filename: file.name,
          progress: 0,
          status: 'uploading' as const,
        }));
        setUploadProgress(initialProgress);

        const response = await fetch('/api/images/upload-multiple', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        if (result.success) {
          uploadResults.push(...result.data.images);

          // Update progress to completed
          setUploadProgress((prev) =>
            prev.map((p) => ({
              ...p,
              progress: 100,
              status: 'completed' as const,
            }))
          );
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } else {
        // Upload single images
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];

          try {
            const formData = new FormData();
            formData.append('image', file);

            // Update progress
            setUploadProgress((prev) => [
              ...prev.filter((p) => p.filename !== file.name),
              { filename: file.name, progress: 0, status: 'uploading' },
            ]);

            const response = await fetch('/api/images/upload', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Upload failed');
            }

            const result = await response.json();
            if (result.success) {
              uploadResults.push(result.data);

              // Update progress
              setUploadProgress((prev) =>
                prev.map((p) =>
                  p.filename === file.name
                    ? { ...p, progress: 100, status: 'completed' }
                    : p
                )
              );
            } else {
              throw new Error(result.message || 'Upload failed');
            }
          } catch (error: any) {
            errors.push(`${file.name}: ${error.message}`);
            setUploadProgress((prev) =>
              prev.map((p) =>
                p.filename === file.name
                  ? { ...p, status: 'error', error: error.message }
                  : p
              )
            );
          }
        }
      }

      setUploadedImages((prev) => [...prev, ...uploadResults]);
      setSelectedFiles([]);

      if (onImagesUploaded && uploadResults.length > 0) {
        onImagesUploaded(uploadResults);
      }

      if (errors.length > 0 && onError) {
        onError(`Some uploads failed:\n${errors.join('\n')}`);
      }
    } catch (error: any) {
      if (onError) {
        onError(`Upload failed: ${error.message}`);
      }

      // Mark all as error
      setUploadProgress((prev) =>
        prev.map((p) => ({
          ...p,
          status: 'error' as const,
          error: error.message,
        }))
      );
    } finally {
      setIsUploading(false);

      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
    }
  }, [selectedFiles, multiple, onImagesUploaded, onError]);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    setUploadedImages([]);
    setUploadProgress([]);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div
              className={`rounded-full p-3 ${
                isDragging ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  isDragging ? 'text-blue-500' : 'text-gray-400'
                }`}
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
            </div>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging
                ? 'Drop images here'
                : 'Drop images here or click to browse'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max{' '}
              {Math.round(maxFileSize / 1024 / 1024)}MB each •
              {acceptedFormats
                .map((f) => f.split('/')[1])
                .join(', ')
                .toUpperCase()}
            </p>
          </div>

          {!disabled && (
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Images
            </button>
          )}
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-x-2">
              <button
                onClick={clearAll}
                disabled={isUploading}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Clear All
              </button>
              <button
                onClick={uploadImages}
                disabled={isUploading || selectedFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  {showPreview && (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-4">Upload Progress</h3>
          <div className="space-y-3">
            {uploadProgress.map((progress, index) => (
              <div key={`${progress.filename}-${index}`} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {progress.filename}
                  </span>
                  <span className="text-xs text-gray-500">
                    {progress.status === 'completed'
                      ? '✅'
                      : progress.status === 'error'
                      ? '❌'
                      : `${progress.progress}%`}
                  </span>
                </div>

                {progress.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                )}

                {progress.status === 'error' && progress.error && (
                  <p className="text-xs text-red-600">{progress.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {showPreview && uploadedImages.length > 0 && (
        <div className={`bg-white rounded-lg border p-4 ${previewClassName}`}>
          <h3 className="font-medium text-gray-900 mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.filename} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={
                      image.thumbnails?.find((t) => t.suffix === 'small')
                        ?.url || image.url
                    }
                    alt={image.originalName}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-2">
                  <p
                    className="text-xs text-gray-600 truncate"
                    title={image.originalName}
                  >
                    {image.originalName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {image.dimensions.width}×{image.dimensions.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
