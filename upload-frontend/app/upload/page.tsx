'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UploadProgress } from '@/components/UploadProgress';
import { FileList } from '@/components/FileList';
import { UploadProgress as UploadProgressType, apiClient } from '@/lib/api';
import { Upload, FileText, Database } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link';

export default function Home() {
  const [currentUpload, setCurrentUpload] = useState<UploadProgressType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    apiClient.clearOldUploadData();
  }, []);

  const handleUploadStart = (file: File) => {
    console.log('Upload started for:', file.name);
  };

  const handleUploadProgress = (progress: UploadProgressType) => {
    setCurrentUpload(progress);
  };

  const handleUploadComplete = (progress: UploadProgressType) => {
    setCurrentUpload(progress);
    // Refresh the file list after upload completes
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
      setCurrentUpload(null);
    }, 2000);
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    setCurrentUpload(null);
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
                <Upload className="h-5 w-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">EdgeStore</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/docs" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            File uploads,
            <br />
            <span className="text-gray-500">simplified.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Secure, fast, and reliable file uploads with real-time progress tracking.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-16">
          <FileUpload
            onUploadStart={handleUploadStart}
            onUploadProgress={handleUploadProgress}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>

        {/* Upload Progress */}
        {currentUpload && (
          <div className="mb-16">
            <UploadProgress progress={currentUpload} />
          </div>
        )}

        {/* File List */}
        <FileList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
