# Components Documentation

This document provides detailed information about the React components used in the file upload frontend.

## Component Architecture

The application follows a component-based architecture with clear separation of concerns:

```
components/
├── ui/                 # shadcn/ui base components
├── FileUpload.tsx     # Main upload component
├── UploadProgress.tsx # Progress tracking component
└── FileList.tsx       # File management component
```

## FileUpload Component

### Overview
The main file upload component with drag-and-drop functionality, file validation, and upload initiation.

### Props Interface
```typescript
interface FileUploadProps {
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: (progress: UploadProgress) => void;
  onUploadError?: (error: Error) => void;
}
```

### Features
- **Drag & Drop**: Uses react-dropzone for intuitive file selection
- **File Validation**: Accepts specific file types (PDF, images, text, ZIP)
- **Visual Feedback**: Dynamic styling based on drag state and upload status
- **Error Handling**: Displays error messages for failed uploads
- **Accessibility**: Keyboard navigation and screen reader support

### Usage Example
```tsx
<FileUpload
  onUploadStart={(file) => console.log('Starting upload:', file.name)}
  onUploadProgress={(progress) => setProgress(progress)}
  onUploadComplete={(progress) => console.log('Upload complete')}
  onUploadError={(error) => console.error('Upload failed:', error)}
/>
```

### Styling
- Uses Tailwind CSS classes for responsive design
- Dynamic border colors based on drag state
- Loading states with opacity changes
- Error states with destructive color scheme

## UploadProgress Component

### Overview
Displays real-time upload progress with detailed chunk information and status indicators.

### Props Interface
```typescript
interface UploadProgressProps {
  progress: UploadProgress;
}
```

### Features
- **Progress Bar**: Visual progress indicator with percentage
- **Chunk Tracking**: Shows individual uploaded chunks as badges
- **Status Icons**: Visual indicators for different upload states
- **File Information**: Displays file name, ID, and size
- **Responsive Layout**: Adapts to different screen sizes

### Status States
- **Uploading**: Blue icon, secondary badge, progress bar active
- **Completed**: Green icon, success badge, completion message
- **Error**: Red icon, destructive badge, error message

### Usage Example
```tsx
<UploadProgress progress={uploadProgress} />
```

### Visual Elements
- Progress bar with percentage display
- Chunk badges showing uploaded chunk indices
- Status-specific icons and colors
- File metadata in a grid layout

## FileList Component

### Overview
Manages and displays uploaded files with download and delete functionality.

### Props Interface
```typescript
interface FileListProps {
  refreshTrigger?: number;
}
```

### Features
- **File Listing**: Displays all uploaded files with metadata
- **Download Functionality**: Downloads files as blobs
- **Delete Functionality**: Removes files from storage
- **Refresh Capability**: Manual refresh trigger
- **Loading States**: Shows loading indicators during operations
- **Empty State**: Friendly message when no files are uploaded

### File Information Display
- File name and ID
- File size (formatted)
- Upload status
- Number of uploaded chunks
- Uploaded chunk indices

### Actions
- **Download**: Creates blob URL and triggers download
- **Delete**: Removes file from localStorage
- **Refresh**: Reloads file list from storage

### Usage Example
```tsx
<FileList refreshTrigger={refreshCounter} />
```

### Error Handling
- Network error display
- File operation error handling
- User-friendly error messages

## shadcn/ui Components

The application uses several shadcn/ui components for consistent styling:

### Button
- Primary, secondary, outline, and destructive variants
- Small and default sizes
- Icon support with proper spacing

### Card
- Card, CardContent, CardHeader, CardTitle
- Consistent padding and spacing
- Shadow and border styling

### Progress
- Animated progress bar
- Percentage display
- Custom styling support

### Badge
- Default, secondary, outline, and destructive variants
- Small size for chunk indicators
- Status-specific colors

### Alert
- Destructive variant for errors
- Icon and description support
- Consistent error styling

## Component Communication

### State Management
Components communicate through props and callbacks:

```tsx
// Parent component manages state
const [uploadProgress, setUploadProgress] = useState(null);

// Child components receive callbacks
<FileUpload onUploadProgress={setUploadProgress} />
<UploadProgress progress={uploadProgress} />
```

### Event Handling
Custom events are used for progress tracking:

```typescript
// API client dispatches progress events
window.dispatchEvent(new CustomEvent('uploadProgress', { detail: progress }));

// Components listen for events
window.addEventListener('uploadProgress', handleProgress);
```

## Responsive Design

All components are built with mobile-first responsive design:

### Breakpoints
- **Mobile**: Default styles
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)

### Layout Adaptations
- Grid layouts adjust column count
- Text sizes scale appropriately
- Spacing adjusts for different screens
- Touch-friendly button sizes

## Accessibility

Components include accessibility features:

### Keyboard Navigation
- Tab order is logical and consistent
- Focus indicators are visible
- Keyboard shortcuts for common actions

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Alt text for icons and images

### Color Contrast
- Meets WCAG AA standards
- High contrast in both light and dark modes
- Status colors are distinguishable

## Performance Considerations

### Optimization Techniques
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes event handlers
- **Lazy Loading**: Components load on demand
- **Virtual Scrolling**: For large file lists (future enhancement)

### Bundle Size
- Tree-shaking for unused code
- Dynamic imports for heavy components
- Optimized icon imports from Lucide React

## Testing

### Component Testing Strategy
- Unit tests for individual components
- Integration tests for component interactions
- Visual regression tests for UI consistency

### Test Utilities
- React Testing Library for component testing
- Jest for unit test framework
- MSW for API mocking

## Future Enhancements

### Planned Features
- **Bulk Operations**: Select and manage multiple files
- **File Preview**: Preview images and documents
- **Upload Queue**: Manage multiple concurrent uploads
- **Progress Persistence**: Resume interrupted uploads
- **File Sharing**: Generate shareable links

### Performance Improvements
- **Virtual Scrolling**: For large file lists
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Route-based splitting
- **Service Worker**: Offline functionality

