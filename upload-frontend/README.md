# File Upload Frontend

A modern, responsive file upload frontend built with Next.js, shadcn/ui, and TypeScript. This application provides a user-friendly interface for uploading files with chunked transfer, real-time progress tracking, and file management capabilities.

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Chunked Transfer**: Large files are split into chunks for reliable upload
- **Real-time Progress**: Live progress tracking with detailed chunk information
- **File Management**: View, download, and delete uploaded files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **File Handling**: react-dropzone
- **State Management**: React hooks

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd upload-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
upload-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── dialog.tsx
│   ├── FileUpload.tsx    # File upload component
│   ├── UploadProgress.tsx # Progress tracking component
│   └── FileList.tsx      # File management component
├── lib/                  # Utility functions
│   ├── utils.ts         # shadcn/ui utilities
│   └── api.ts           # API client
├── public/              # Static assets
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🧩 Components

### FileUpload Component

The main upload component with drag-and-drop functionality.

**Props:**
- `onUploadStart?: (file: File) => void` - Called when upload starts
- `onUploadProgress?: (progress: UploadProgress) => void` - Called during upload
- `onUploadComplete?: (progress: UploadProgress) => void` - Called when upload completes
- `onUploadError?: (error: Error) => void` - Called on upload error

**Features:**
- Drag and drop support
- File type validation
- Upload progress tracking
- Error handling

### UploadProgress Component

Displays real-time upload progress with chunk information.

**Props:**
- `progress: UploadProgress` - Upload progress data

**Features:**
- Progress bar with percentage
- Chunk tracking visualization
- Status indicators
- File information display

### FileList Component

Manages and displays uploaded files.

**Props:**
- `refreshTrigger?: number` - Triggers list refresh when changed

**Features:**
- File listing with metadata
- Download functionality
- Delete functionality
- Status indicators
- Responsive design

## 🔌 API Integration

The frontend communicates with the gRPC backend through a REST gateway. The API client (`lib/api.ts`) provides methods for:

- **File Upload**: Chunked file upload with progress tracking
- **Metadata Retrieval**: Get upload metadata and status
- **File Download**: Download uploaded files
- **Chunk Management**: Track uploaded chunks

### API Endpoints

- `GET /v1/uploads/{file_id}/metadata` - Get upload metadata
- `GET /v1/files/{file_id}` - Download file
- `POST /v1/upload` - Upload file chunks (gRPC streaming)

## 🎨 Styling

The application uses Tailwind CSS with shadcn/ui components for a modern, accessible design:

- **Color Scheme**: Neutral base with primary accent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. **Deploy**: Vercel will automatically build and deploy

### Docker

1. **Build the Docker image**:
   ```bash
   docker build -t upload-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 upload-frontend
   ```

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |

### shadcn/ui Configuration

The project is configured with shadcn/ui using the following settings:
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Tailwind CSS**: v4
- **Import Alias**: `@/`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. **Install shadcn/ui components**:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Create custom components** in the `components/` directory

3. **Import and use** in your pages or components

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)
- **Import Order**: Absolute imports preferred

## 🐛 Troubleshooting

### Common Issues

1. **Upload not working**:
   - Check if the backend is running
   - Verify `NEXT_PUBLIC_API_URL` environment variable
   - Check browser console for errors

2. **Styling issues**:
   - Ensure Tailwind CSS is properly configured
   - Check if shadcn/ui components are installed
   - Verify CSS imports in `app/globals.css`

3. **TypeScript errors**:
   - Run `npm run lint` to check for issues
   - Ensure all imports are correct
   - Check type definitions

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Dropzone Documentation](https://react-dropzone.js.org)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

Built with ❤️ using Next.js, shadcn/ui, and modern web technologies.