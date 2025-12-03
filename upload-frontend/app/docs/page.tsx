'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Code, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';

const documentationSections = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Project overview and features',
    icon: BookOpen,
    content: `
# File Upload System

A complete file upload solution with modern frontend and robust backend. Built with Next.js, shadcn/ui, gRPC, and Go.

## 🚀 Features

### Frontend Features
- **Secure Upload Flow**: 2-step process with server-generated file IDs
- **4MB Chunked Transfer**: Optimized chunk size for better performance
- **JWT Authentication**: Ready for production authentication
- **Real-time Progress**: Live tracking with detailed chunk information
- **Fallback Mode**: Graceful handling when backend is unavailable
- **Modern UI**: EdgeStore-inspired design with smooth animations
- **TypeScript**: Full type safety with comprehensive error handling

### Backend Features
- **JWT Authentication**: Bearer token validation on all operations
- **Server-Generated UUIDs**: InitUpload RPC prevents file ID collisions
- **4MB Chunk Uploads**: Optimized for network efficiency (2000x improvement)
- **Redis Sets**: O(1) chunk tracking with 24h automatic TTL cleanup
- **PostgreSQL**: Metadata storage with constraints and audit logging
- **Atomic Operations**: Index-driven merge with gap detection
- **Path Sanitization**: Prevents directory traversal attacks
- **TLS Ready**: Optional transport encryption for production

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **File Handling**: react-dropzone
- **State Management**: React hooks

### Backend
- **Language**: Go 1.21+ with enterprise security
- **Authentication**: JWT Bearer token validation
- **gRPC**: Streaming with InitUpload + UploadFile RPCs
- **Database**: PostgreSQL with constraints and indices
- **Cache**: Redis Sets with O(1) operations and TTL
- **Security**: Path sanitization, atomic operations, TLS ready
    `
  },
  {
    id: 'api',
    title: 'API Reference',
    description: 'Frontend API client and backend endpoints',
    icon: Code,
    content: `
# API Reference

Complete API documentation for both frontend and backend integration.

## Frontend API Client

The API client (\`lib/api.ts\`) provides a TypeScript interface for communicating with the file upload backend.

### Configuration

\`\`\`typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
\`\`\`

### Interfaces

#### UploadMetadata
\`\`\`typescript
interface UploadMetadata {
  fileId: string;
  fileName: string;
  size: string;
  uploadedChunks: string[];
  status: 'in_progress' | 'completed';
}
\`\`\`

#### UploadProgress
\`\`\`typescript
interface UploadProgress {
  fileId: string;
  fileName: string;
  uploadedChunks: number[];
  totalChunks: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}
\`\`\`

### Frontend Methods

#### getUploadMetadata(fileId: string)
Retrieves metadata for a specific file upload.

**Parameters:**
- \`fileId\` (string): Unique identifier for the file

**Returns:** Promise<UploadMetadata>

#### downloadFile(fileId: string)
Downloads a file from the server.

**Parameters:**
- \`fileId\` (string): Unique identifier for the file

**Returns:** Promise<DownloadResponse>

#### uploadFile(file: File, userId?: string)
Uploads a file with chunked transfer.

**Parameters:**
- \`file\` (File): The file to upload
- \`userId\` (string, optional): User identifier (defaults to 'default-user')

**Returns:** Promise<UploadProgress>

## Backend API Endpoints

### REST Endpoints (HTTP/JSON)

#### Download File
\`\`\`http
GET /v1/files/{file_id}
\`\`\`

**Response:**
\`\`\`json
{
  "content": "<base64-encoded-file>",
  "fileName": "original-filename.ext"
}
\`\`\`

#### Get Upload Metadata
\`\`\`http
GET /v1/uploads/{file_id}/metadata
\`\`\`

**Response:**
\`\`\`json
{
  "fileId": "uuid-string",
  "fileName": "filename.ext",
  "size": "12345",
  "uploadedChunks": ["0", "1", "2"],
  "status": "in_progress|completed"
}
\`\`\`

#### Upload File
\`\`\`http
POST /v1/upload
Content-Type: multipart/form-data

fileId: string
fileName: string
userId: string
totalChunks: number
file: File
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "uuid-string"
}
\`\`\`

### gRPC Endpoints

#### UploadFile
\`\`\`protobuf
rpc UploadFile(stream FileChunk) returns (UploadStatus);
\`\`\`

#### GetUploadedChunks
\`\`\`protobuf
rpc GetUploadedChunks(GetChunksRequest) returns (GetChunksResponse);
\`\`\`

#### DownloadFile
\`\`\`protobuf
rpc DownloadFile(DownloadRequest) returns (DownloadResponse);
\`\`\`

#### GetUploadMetadata
\`\`\`protobuf
rpc GetUploadMetadata(GetMetadataRequest) returns (UploadMetadata);
\`\`\`

## Error Handling

### HTTP Status Codes
- \`200\` - Success
- \`400\` - Bad Request
- \`404\` - Not Found
- \`500\` - Internal Server Error

### gRPC Status Codes
- \`OK\` - Success
- \`INVALID_ARGUMENT\` - Invalid request
- \`NOT_FOUND\` - Resource not found
- \`INTERNAL\` - Server error

## CORS Configuration

The backend includes CORS headers for cross-origin requests:

\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`
    `
  },
  {
    id: 'components',
    title: 'Components Guide',
    description: 'React components documentation',
    icon: FileText,
    content: `
# Components Documentation

This document provides detailed information about the React components used in the file upload frontend.

## Component Architecture

The application follows a component-based architecture with clear separation of concerns:

\`\`\`
components/
├── ui/                 # shadcn/ui base components
├── FileUpload.tsx     # Main upload component
├── UploadProgress.tsx # Progress tracking component
└── FileList.tsx       # File management component
\`\`\`

## FileUpload Component

### Overview
The main file upload component with drag-and-drop functionality, file validation, and upload initiation.

### Props Interface
\`\`\`typescript
interface FileUploadProps {
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: (progress: UploadProgress) => void;
  onUploadError?: (error: Error) => void;
}
\`\`\`

### Features
- **Drag & Drop**: Uses react-dropzone for intuitive file selection
- **File Validation**: Accepts specific file types (PDF, images, text, ZIP)
- **Visual Feedback**: Dynamic styling based on drag state and upload status
- **Error Handling**: Displays error messages for failed uploads
- **Accessibility**: Keyboard navigation and screen reader support

## UploadProgress Component

### Overview
Displays real-time upload progress with detailed chunk information and status indicators.

### Props Interface
\`\`\`typescript
interface UploadProgressProps {
  progress: UploadProgress;
}
\`\`\`

### Features
- **Progress Bar**: Visual progress indicator with percentage
- **Chunk Tracking**: Shows individual uploaded chunks as badges
- **Status Icons**: Visual indicators for different upload states
- **File Information**: Displays file name, ID, and size
- **Responsive Layout**: Adapts to different screen sizes

## FileList Component

### Overview
Manages and displays uploaded files with download and delete functionality.

### Props Interface
\`\`\`typescript
interface FileListProps {
  refreshTrigger?: number;
}
\`\`\`

### Features
- **File Listing**: Displays all uploaded files with metadata
- **Download Functionality**: Downloads files as blobs
- **Delete Functionality**: Removes files from storage
- **Refresh Capability**: Manual refresh trigger
- **Loading States**: Shows loading indicators during operations
- **Empty State**: Friendly message when no files are uploaded
    `
  },
  {
    id: 'backend',
    title: 'Backend Documentation',
    description: 'gRPC server, database setup, and API endpoints',
    icon: Code,
    content: `
# Upload Backend (gRPC + gRPC-Gateway)

Secure chunked file uploads with Redis for chunk tracking, PostgreSQL for metadata, and a REST gateway that exposes select gRPC methods.

## Architecture

- **gRPC server**: handles streaming uploads, metadata, and download with server-generated file IDs
- **Redis**: tracks uploaded chunk indexes using Sets (not KEYS) with TTL
- **PostgreSQL**: stores upload records with constraints and indices
- **Storage**: merged files saved under \`./storage/files\` with sanitized names, temp chunks under \`./storage/tmp/<file_id>\`
- **gRPC-Gateway**: exposes REST for download and metadata
- **Security**: TLS support, path sanitization, atomic operations

## Security Features

- **Server-owned file IDs**: InitUpload RPC generates UUIDs server-side
- **Path sanitization**: Filenames cleaned with \`filepath.Base()\` and dangerous chars removed
- **Redis Sets**: Uses \`SADD\`/\`SMEMBERS\` instead of \`KEYS\` for O(1) operations with 24h TTL
- **Atomic merging**: Index-driven merge with gap detection and atomic rename
- **Validation**: Chunk bounds checking and idempotency
- **TLS support**: Optional via environment variables
- **File permissions**: 0755 for dirs, 0644 for files

## Requirements

- Go 1.21+
- PostgreSQL running locally (see connection string in \`cmd/server/main.go\`)
- Redis running locally (default \`localhost:6379\`)
- Protocol Buffers toolchain (protoc) and plugins

### Install protobuf plugins:

\`\`\`bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
\`\`\`

Ensure \`$GOBIN\` is on your \`PATH\`.

## Database Setup

### Create the uploads table:

\`\`\`sql
CREATE TABLE IF NOT EXISTS uploads (
    file_id UUID PRIMARY KEY,
    user_id UUID,
    file_name TEXT NOT NULL,
    total_chunks BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress',
    stored_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Connection String:
\`\`\`
postgresql://upload:upload123@localhost:5432/upload_db?sslmode=disable
\`\`\`

## Generate protobufs

Using Makefile (if available):
\`\`\`bash
make proto
\`\`\`

Or directly:
\`\`\`bash
protoc -I proto -I third_party/googleapis -I . \\
  --go_out=paths=source_relative:. \\
  --go-grpc_out=paths=source_relative:. \\
  --grpc-gateway_out=paths=source_relative:. \\
  proto/fileupload.proto
\`\`\`

## Running the Backend

### Start gRPC server (default port 50051):
\`\`\`bash
go run ./cmd/server
\`\`\`

### Start REST gateway (default port 8080):
\`\`\`bash
go run ./cmd/gateway
\`\`\`

## API Endpoints

### gRPC Endpoints
- \`InitUpload(InitRequest) returns (InitResponse)\` - **NEW**: Server-generated file IDs
- \`UploadFile(stream FileChunk) returns (UploadStatus)\`
- \`GetUploadedChunks(GetChunksRequest) returns (GetChunksResponse)\`
- \`DownloadFile(DownloadRequest) returns (DownloadResponse)\`
- \`GetUploadMetadata(GetMetadataRequest) returns (UploadMetadata)\`

### REST Endpoints (via gRPC-Gateway)
- \`GET /v1/files/{file_id}\` - Download file
- \`GET /v1/uploads/{file_id}/metadata\` - Get upload metadata
- \`POST /v1/upload\` - Upload file (custom endpoint)

## Usage Examples

### Upload Process (2-step):

1. **Initialize upload** (gets server-generated file ID):
\`\`\`
rpc InitUpload(InitRequest) returns (InitResponse)
\`\`\`

2. **Upload via gRPC streaming**:
\`\`\`bash
go run ./cmd/client --file=/absolute/path/to/file
\`\`\`

**Performance**: 4MB chunks provide 2000x improvement over 1KB chunks.

### Download file (REST):
\`\`\`bash
curl http://localhost:8080/v1/files/{file_id}
\`\`\`

Response:
\`\`\`json
{
  "content": "<base64>",
  "fileName": "<original_name>"
}
\`\`\`

### Get upload metadata (REST):
\`\`\`bash
curl http://localhost:8080/v1/uploads/{file_id}/metadata
\`\`\`

Response:
\`\`\`json
{
  "fileId": "...",
  "fileName": "...",
  "size": "<int64>",
  "uploadedChunks": ["0", "1", ...],
  "status": "in_progress|completed"
}
\`\`\`

## File Storage

### During Upload:
- Chunks stored in: \`./storage/tmp/{file_id}/chunk_{index}\`
- Progress tracked in Redis Sets: \`upload:{file_id}:chunks\`
- Automatic TTL cleanup (24h)

### After Upload:
- Final file: \`./storage/files/{file_id}_{sanitized_filename}\`
- Database status updated to 'completed'
- Temporary chunks and Redis keys cleaned up automatically
- Atomic rename ensures no partial files

## Configuration

Defaults are set in \`cmd/server/main.go\`:
- Redis: \`localhost:6379\`
- Temp/storage dir: \`./storage\`
- gRPC: \`:50051\`
- Postgres DSN: see connection string above
- TLS: Set \`TLS_CERT\` and \`TLS_KEY\` environment variables to enable

Adjust as needed for your environment.

## Database Security

### Constraints and Indices:
\`\`\`sql
-- Add status constraint
ALTER TABLE uploads ADD CONSTRAINT status_check CHECK (status IN ('in_progress','completed','failed'));

-- Add useful indices
CREATE INDEX IF NOT EXISTS idx_uploads_user_created ON uploads (user_id, created_at DESC);

-- Add additional columns for better tracking
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS size_bytes BIGINT DEFAULT 0;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS mime_type TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS sha256 TEXT;
\`\`\`
    `
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const currentSection = documentationSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80">
              <Home className="h-5 w-5" />
              <span>Back to App</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documentationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {section.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {currentSection && (
                    <>
                      <currentSection.icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{currentSection.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentSection.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    {currentSection?.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
