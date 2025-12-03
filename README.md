# Chat App - File Upload System

A full-stack file upload application with enterprise-grade security, chunked transfers, and real-time progress tracking.

## 🏗️ Architecture

This project consists of two main components:

- **Backend** (`upload-backend/`): Go-based gRPC server with REST gateway
- **Frontend** (`upload-frontend/`): Next.js React application with modern UI

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI   │───▶│  gRPC Gateway    │───▶│   gRPC Server   │
│   (Port 3000)  │    │   (Port 8080)    │    │   (Port 50051)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Redis       │    │   PostgreSQL    │
                       │ (Chunk Tracking)│    │   (Metadata)    │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Go 1.21+**
- **Node.js 18+**
- **PostgreSQL**
- **Redis**

### 1. Backend Setup

```bash
cd upload-backend

# Install dependencies
go mod download

# Set up database
createdb upload_db
psql -d upload_db -f create_uploads_table.sql
psql -d upload_db -f migrations.sql

# Start Redis
redis-server

# Generate protobuf files
make proto

# Start gRPC server
go run ./cmd/server &

# Start REST gateway
go run ./cmd/gateway &
```

### 2. Frontend Setup

```bash
cd upload-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **REST API**: http://localhost:8080
- **gRPC Server**: localhost:50051

## 🔧 Configuration

### Backend Environment Variables

```bash
# Security
JWT_SECRET=your-secret-key
TLS_CERT=/path/to/cert.pem          # Optional
TLS_KEY=/path/to/key.pem            # Optional

# Database
POSTGRES_DSN=postgresql://upload:upload123@localhost:5432/upload_db?sslmode=disable
REDIS_ADDR=localhost:6379

# Server
GRPC_PORT=50051
GATEWAY_PORT=8080
STORAGE_DIR=./storage
```

### Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📋 Features

### 🔒 Security
- Server-generated UUIDs prevent file collisions
- JWT authentication on all endpoints
- Path sanitization prevents directory traversal
- Optional TLS encryption
- Input validation and bounds checking

### ⚡ Performance
- 4MB chunked uploads for optimal network efficiency
- Redis-based O(1) chunk tracking
- Idempotent uploads (duplicate chunks skipped)
- Atomic file operations with proper cleanup

### 🎨 User Experience
- Drag & drop file upload
- Real-time progress tracking
- Responsive design with dark mode
- File management (view, download, delete)
- Modern UI with shadcn/ui components

## 🛠️ Development

### Project Structure

```
chat-app/
├── upload-backend/          # Go gRPC server
│   ├── cmd/                # Server executables
│   ├── internal/           # Internal packages
│   ├── pb/                 # Generated protobuf files
│   ├── proto/              # Protobuf definitions
│   └── storage/            # File storage
└── upload-frontend/        # Next.js frontend
    ├── app/                # Next.js App Router
    ├── components/         # React components
    ├── lib/                # Utilities and API client
    └── public/             # Static assets
```

### API Endpoints

#### gRPC Services
- `InitUpload` - Initialize file upload (returns UUID)
- `UploadFile` - Stream file chunks
- `GetUploadedChunks` - Get uploaded chunk indexes

#### REST Gateway
- `GET /v1/uploads/{file_id}/metadata` - Get upload metadata
- `GET /v1/files/{file_id}` - Download file
- `POST /v1/upload` - Upload file chunks

### Testing

#### Backend
```bash
cd upload-backend

# Test upload
go run ./cmd/client --file=/path/to/testfile

# Test REST API
curl http://localhost:8080/v1/uploads/{file_id}/metadata
```

#### Frontend
```bash
cd upload-frontend

# Run linting
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: upload_db
      POSTGRES_USER: upload
      POSTGRES_PASSWORD: upload123
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./upload-backend
    ports:
      - "50051:50051"
      - "8080:8080"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./upload-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Production Considerations

- Use environment-specific configuration files
- Enable TLS for production deployments
- Set up proper logging and monitoring
- Configure database connection pooling
- Implement rate limiting and file size restrictions

## 📚 Documentation

- [Backend Documentation](upload-backend/README.md)
- [Frontend Documentation](upload-frontend/README.md)
- [API Documentation](upload-frontend/docs/API.md)
- [Component Documentation](upload-frontend/docs/COMPONENTS.md)
- [Deployment Guide](upload-frontend/docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the component-specific documentation
- Review the troubleshooting sections in individual READMEs

---

Built with Go, Next.js, and modern web technologies for enterprise-grade file uploads.