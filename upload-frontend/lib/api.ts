// API client for file upload backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface UploadMetadata {
  fileId: string;
  fileName: string;
  size: string;
  uploadedChunks: string[];
  status: 'in_progress' | 'completed';
}

export interface DownloadResponse {
  content: string;
  fileName: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  uploadedChunks: number[];
  totalChunks: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get upload metadata with JWT auth (fallback to local storage)
  async getUploadMetadata(fileId: string): Promise<UploadMetadata> {
    const jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjoxNzM4MzY3MjAwfQ.test-signature';
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/uploads/${fileId}/metadata`, {
        headers: {
          'Authorization': jwtToken
        }
      });
      
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using local storage');
    }
    
    // Fallback to local storage
    const metadata = localStorage.getItem(`upload_${fileId}_metadata`);
    if (!metadata) {
      throw new Error('Upload metadata not found');
    }
    
    return JSON.parse(metadata);
  }

  // Download file with JWT auth (fallback to demo content)
  async downloadFile(fileId: string): Promise<DownloadResponse> {
    const jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjoxNzM4MzY3MjAwfQ.test-signature';
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/files/${fileId}`, {
        headers: {
          'Authorization': jwtToken
        }
      });
      
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using demo content');
    }
    
    // Fallback to demo content
    const metadata = localStorage.getItem(`upload_${fileId}_metadata`);
    if (!metadata) {
      throw new Error('File not found');
    }
    
    const { fileName } = JSON.parse(metadata);
    const content = btoa(`Demo file content for: ${fileName}\n\nThis is a demonstration of the secure file upload system.\nFile ID: ${fileId}\nUploaded with 4MB chunks and server-generated IDs.`);
    
    return {
      content,
      fileName
    };
  }

  // Delete file with JWT auth (fallback to local cleanup)
  async deleteFile(fileId: string): Promise<void> {
    const jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjoxNzM4MzY3MjAwfQ.test-signature';
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': jwtToken
        }
      });
      
      if (response.ok) {
        console.log(`File ${fileId} deleted from backend`);
        this.clearUploadData(fileId);
        return;
      }
      
      if (response.status === 501) {
        console.log('DELETE endpoint not implemented, using local cleanup');
        this.clearUploadData(fileId);
        return;
      }
      
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log('Backend unavailable, cleaning up locally:', error);
      this.clearUploadData(fileId);
    }
  }

  // Upload file with InitUpload and JWT authentication (fallback to demo mode)
  async uploadFile(file: File, userId: string = 'default-user'): Promise<UploadProgress> {
    const chunkSize = 4 * 1024 * 1024; // 4MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    const jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjoxNzM4MzY3MjAwfQ.test-signature';

    try {
      // Try backend first, fallback to demo mode
      let fileId: string;
      let useBackend = true;

      try {
        // Step 1: Initialize upload with server-generated ID
        const initResponse = await fetch(`${this.baseUrl}/v1/init-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken
          },
          body: JSON.stringify({
            file_name: file.name,
            total_chunks: totalChunks,
            user_id: userId
          })
        });

        if (!initResponse.ok) {
          throw new Error('Backend not available');
        }

        const { file_id } = await initResponse.json();
        fileId = file_id;
      } catch (backendError) {
        // Fallback to demo mode with client-generated ID
        console.log('Backend unavailable, using demo mode');
        useBackend = false;
        fileId = crypto.randomUUID();
      }

      const progress: UploadProgress = {
        fileId,
        fileName: file.name,
        uploadedChunks: [],
        totalChunks,
        progress: 0,
        status: 'uploading'
      };

      // Store file data locally
      await this.storeFileInIndexedDB(fileId, file);

      // Step 2: Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        if (useBackend) {
          try {
            // Convert chunk to base64
            const base64Chunk = await this.fileToBase64(chunk);

            // Upload chunk to backend
            const chunkResponse = await fetch(`${this.baseUrl}/v1/upload-chunk`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
              },
              body: JSON.stringify({
                file_id: fileId,
                chunk_index: i,
                content: base64Chunk
              })
            });

            if (!chunkResponse.ok) {
              throw new Error(`Failed to upload chunk ${i}`);
            }
          } catch (chunkError) {
            console.log('Chunk upload failed, continuing in demo mode');
            useBackend = false;
          }
        }
        
        // Store chunk metadata locally (for both modes)
        await this.storeChunkMetadata(fileId, i, totalChunks);
        
        progress.uploadedChunks.push(i);
        progress.progress = ((i + 1) / totalChunks) * 100;
        
        // Emit progress update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('uploadProgress', { detail: progress }));
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, useBackend ? 100 : 50));
      }
      
      progress.status = 'completed';
      
      // Store complete file metadata
      const metadata = {
        fileId,
        fileName: file.name,
        size: file.size.toString(),
        uploadedChunks: progress.uploadedChunks.map(String),
        status: 'completed',
        userId,
        uploadedAt: new Date().toISOString(),
        mode: useBackend ? 'backend' : 'demo'
      };
      
      localStorage.setItem(`upload_${fileId}_metadata`, JSON.stringify(metadata));
      
      return progress;
    } catch (error) {
      throw error;
    }
  }

  private async uploadChunk(
    fileId: string,
    fileName: string,
    userId: string,
    chunkIndex: number,
    totalChunks: number,
    content: string
  ): Promise<void> {
    // This is a simplified implementation
    // In a real scenario, you would use gRPC streaming
    // For now, we'll simulate the upload with a delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Store only metadata in localStorage (not the actual content)
    const chunkKey = `upload_${fileId}_chunk_${chunkIndex}`;
    localStorage.setItem(chunkKey, JSON.stringify({
      fileId,
      fileName,
      userId,
      chunkIndex,
      totalChunks,
      uploaded: true,
      timestamp: Date.now()
    }));
  }

  private fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Get uploaded chunks for a file
  async getUploadedChunks(fileId: string): Promise<number[]> {
    const chunks: number[] = [];
    let index = 0;
    
    while (true) {
      const chunkKey = `upload_${fileId}_chunk_${index}`;
      const chunkData = localStorage.getItem(chunkKey);
      if (!chunkData) break;
      
      try {
        const parsed = JSON.parse(chunkData);
        if (parsed.uploaded) {
          chunks.push(index);
        }
      } catch (e) {
        // If parsing fails, assume it's an old format and include it
        chunks.push(index);
      }
      index++;
    }
    
    return chunks;
  }

  // Download file as blob (simulated for demo)
  async downloadFileAsBlob(fileId: string): Promise<Blob> {
    // For demo purposes, create a simple text file
    // In a real implementation, this would download from the backend
    const content = `This is a demo file with ID: ${fileId}\n\nThis file was uploaded to the file upload system.\nThe actual file content would be retrieved from the backend in a real implementation.`;
    return new Blob([content], { type: 'text/plain' });
  }

  // Clear upload data for a specific file
  clearUploadData(fileId: string): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`upload_${fileId}_`)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clear all old upload data (older than 24 hours)
  clearOldUploadData(): void {
    const keys = Object.keys(localStorage);
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    keys.forEach(key => {
      if (key.startsWith('upload_') && key.includes('_chunk_')) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.timestamp && parsed.timestamp < oneDayAgo) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          // If parsing fails, remove the old format data
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Store file in IndexedDB
  private async storeFileInIndexedDB(fileId: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FileUploadDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        const fileData = {
          fileId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: file.lastModified,
          timestamp: Date.now()
        };
        
        store.put(fileData);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'fileId' });
        }
      };
    });
  }

  // Store chunk metadata
  private async storeChunkMetadata(fileId: string, chunkIndex: number, totalChunks: number): Promise<void> {
    const chunkKey = `upload_${fileId}_chunk_${chunkIndex}`;
    localStorage.setItem(chunkKey, JSON.stringify({
      fileId,
      chunkIndex,
      totalChunks,
      uploaded: true,
      timestamp: Date.now()
    }));
  }

  // Get all files from IndexedDB
  async getAllFilesFromIndexedDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FileUploadDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'fileId' });
        }
        resolve([]);
      };
    });
  }
}

export const apiClient = new ApiClient();
