# API Documentation

This document describes the API client and integration with the gRPC backend.

## API Client

The API client (`lib/api.ts`) provides a TypeScript interface for communicating with the file upload backend.

### Configuration

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

### Interfaces

#### UploadMetadata
```typescript
interface UploadMetadata {
  fileId: string;
  fileName: string;
  size: string;
  uploadedChunks: string[];
  status: 'in_progress' | 'completed';
}
```

#### UploadProgress
```typescript
interface UploadProgress {
  fileId: string;
  fileName: string;
  uploadedChunks: number[];
  totalChunks: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}
```

#### DownloadResponse
```typescript
interface DownloadResponse {
  content: string;
  fileName: string;
}
```

## Methods

### getUploadMetadata(fileId: string)
Retrieves metadata for a specific file upload.

**Parameters:**
- `fileId` (string): Unique identifier for the file

**Returns:** Promise<UploadMetadata>

**Example:**
```typescript
const metadata = await apiClient.getUploadMetadata('file-123');
console.log(metadata.fileName); // "document.pdf"
```

### downloadFile(fileId: string)
Downloads a file from the server.

**Parameters:**
- `fileId` (string): Unique identifier for the file

**Returns:** Promise<DownloadResponse>

**Example:**
```typescript
const response = await apiClient.downloadFile('file-123');
// response.content contains base64 encoded file data
```

### uploadFile(file: File, userId?: string)
Uploads a file with chunked transfer using the new 2-step process.

**Process:**
1. Calls InitUpload to get server-generated file ID
2. Uploads file in 2MB chunks with validation and idempotency

**Parameters:**
- `file` (File): The file to upload
- `userId` (string, optional): User identifier (defaults to 'default-user')

**Returns:** Promise<UploadProgress>

**Example:**
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const progress = await apiClient.uploadFile(file, 'user-123');
// File ID is now server-generated for security
```

### downloadFileAsBlob(fileId: string)
Downloads a file as a Blob object for direct browser download.

**Parameters:**
- `fileId` (string): Unique identifier for the file

**Returns:** Promise<Blob>

**Example:**
```typescript
const blob = await apiClient.downloadFileAsBlob('file-123');
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'downloaded-file.pdf';
a.click();
```

### getUploadedChunks(fileId: string)
Gets the list of uploaded chunks for a file.

**Parameters:**
- `fileId` (string): Unique identifier for the file

**Returns:** Promise<number[]>

**Example:**
```typescript
const chunks = await apiClient.getUploadedChunks('file-123');
console.log(`Uploaded ${chunks.length} chunks`);
```

## Backend Integration

The frontend communicates with the gRPC backend through a REST gateway that exposes the following endpoints:

### REST Endpoints

#### GET /v1/uploads/{file_id}/metadata
Retrieves upload metadata for a specific file.

**Response:**
```json
{
  "fileId": "uuid-string",
  "fileName": "document.pdf",
  "size": "1048576",
  "uploadedChunks": ["0", "1", "2"],
  "status": "in_progress"
}
```

#### GET /v1/files/{file_id}
Downloads a file.

**Response:**
```json
{
  "content": "base64-encoded-file-content",
  "fileName": "document.pdf"
}
```

### gRPC Streaming

The actual file upload uses gRPC streaming for efficient chunked transfer:

```protobuf
service FileUploadService {
    rpc InitUpload(InitRequest) returns (InitResponse);  // NEW: Server-generated IDs
    rpc UploadFile(stream FileChunk) returns (UploadStatus);
    rpc GetUploadedChunks(GetChunksRequest) returns (GetChunksResponse);
    rpc DownloadFile(DownloadRequest) returns (DownloadResponse);
    rpc GetUploadMetadata(GetMetadataRequest) returns (UploadMetadata);
}

message InitRequest {
    string file_name = 1;
    int64 total_chunks = 2;
    string user_id = 3;
}

message InitResponse {
    string file_id = 1;  // Server-generated UUID
}
```

## Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const metadata = await apiClient.getUploadMetadata('invalid-id');
} catch (error) {
  console.error('Failed to get metadata:', error.message);
}
```

Common error scenarios:
- Network connectivity issues
- Invalid file IDs
- Server errors (5xx)
- Authentication failures

## Progress Tracking

Upload progress is tracked through custom events:

```typescript
// Listen for progress updates
window.addEventListener('uploadProgress', (event) => {
  const progress = event.detail;
  console.log(`Upload progress: ${progress.progress}%`);
});

// Upload a file
await apiClient.uploadFile(file);
```

## Local Storage

For demonstration purposes, the API client uses localStorage to simulate chunk storage:

- Chunks are stored with keys: `upload_{fileId}_chunk_{index}`
- Each chunk contains metadata and base64 content
- This is a simplified implementation for frontend demonstration

## Security Improvements (Implemented)

✅ **Server-owned file IDs**: InitUpload RPC generates UUIDs server-side
✅ **Path sanitization**: Filenames cleaned and dangerous chars removed
✅ **Redis performance**: Uses Sets instead of KEYS for O(1) operations
✅ **Atomic operations**: Index-driven merge with gap detection
✅ **Input validation**: Chunk bounds checking and idempotency
✅ **TLS support**: Optional transport encryption
✅ **File permissions**: Secure 0755/0644 permissions

## Production Considerations

In a production environment, consider:

1. **Authentication**: Add JWT tokens or session management
2. **Error Recovery**: Implement retry logic for failed chunks
3. **Progress Persistence**: Store progress in a database
4. **Rate Limiting**: Implement upload rate limiting
5. **Monitoring**: Add structured logging and metrics
6. **Database**: Use connection pooling and read replicas

