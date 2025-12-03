'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  File, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { apiClient, UploadMetadata } from '@/lib/api';

interface FileListProps {
  refreshTrigger?: number;
}

export function FileList({ refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<UploadMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load files from IndexedDB
      const fileMetadata: UploadMetadata[] = [];
      
      // Get all files from IndexedDB
      const files = await apiClient.getAllFilesFromIndexedDB();
      
      for (const file of files) {
        // Get uploaded chunks for this file
        const uploadedChunks = await apiClient.getUploadedChunks(file.fileId);
        
        fileMetadata.push({
          fileId: file.fileId,
          fileName: file.fileName,
          size: file.fileSize.toString(),
          uploadedChunks: uploadedChunks.map(String),
          status: uploadedChunks.length > 0 ? 'completed' : 'in_progress'
        });
      }
      
      // Sort files: completed first, then in_progress
      fileMetadata.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (b.status === 'completed' && a.status !== 'completed') return 1;
        return 0;
      });
      
      setFiles(fileMetadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      loadFiles();
    }
  }, [refreshTrigger, isClient]);

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const blob = await apiClient.downloadFileAsBlob(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    try {
      setError(null);
      
      // Delete from backend (includes physical files and folders)
      await apiClient.deleteFile(fileId);
      
      // Update local state immediately
      setFiles(files.filter(file => file.fileId !== fileId));
      
      console.log(`Successfully deleted file: ${fileName}`);
    } catch (err) {
      console.error('Delete error:', err);
      // Still remove from UI since local cleanup happened
      setFiles(files.filter(file => file.fileId !== fileId));
      setError(`File removed locally. ${err instanceof Error ? err.message : 'Backend deletion may have failed'}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isClient) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Initializing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading files...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Uploaded Files</h2>
        <Button onClick={loadFiles} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-muted-foreground">
              Upload your first file using the upload area above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <Card key={file.fileId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <CardTitle className="text-lg">{file.fileName}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">
                        ID: {file.fileId}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(file.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chunks:</span>
                    <p>{file.uploadedChunks.length} uploaded</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="capitalize">{file.status}</p>
                  </div>
                </div>

                {file.uploadedChunks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-sm text-muted-foreground">Uploaded Chunks:</span>
                    <div className="flex flex-wrap gap-1">
                      {file.uploadedChunks.map((chunkIndex) => (
                        <Badge key={chunkIndex} variant="outline" className="text-xs">
                          {chunkIndex}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={() => handleDownload(file.fileId, file.fileName)}
                    size="sm"
                    disabled={file.status !== 'completed'}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handleDelete(file.fileId, file.fileName)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
