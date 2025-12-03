'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, AlertCircle } from 'lucide-react';
import { apiClient, UploadProgress } from '@/lib/api';

interface FileUploadProps {
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: (progress: UploadProgress) => void;
  onUploadError?: (error: Error) => void;
}

export function FileUpload({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setIsUploading(true);

    // Define the progress handler outside the try block
    const handleProgress = (event: CustomEvent<UploadProgress>) => {
      onUploadProgress?.(event.detail);
    };

    try {
      onUploadStart?.(file);

      // Listen for progress updates
      window.addEventListener('uploadProgress', handleProgress as EventListener);

      const progress = await apiClient.uploadFile(file);

      onUploadComplete?.(progress);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error.message);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
      window.removeEventListener('uploadProgress', handleProgress as EventListener);
    }
  }, [onUploadStart, onUploadProgress, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading || !isClient,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt', '.md', '.json', '.csv'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    }
  });

  if (!isClient) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white"></div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Initializing...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900/50' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {isUploading ? (
              <div className="animate-spin">
                <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
            ) : (
              <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {isUploading 
                ? 'Uploading...' 
                : isDragActive 
                  ? 'Drop your file here' 
                  : 'Choose a file or drag & drop it here'
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isUploading 
                ? 'Please wait while your file is being processed'
                : 'PDF, image, text, and ZIP files are supported'
              }
            </p>
          </div>
          
          {!isUploading && (
            <Button 
              variant="outline" 
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Browse File
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
