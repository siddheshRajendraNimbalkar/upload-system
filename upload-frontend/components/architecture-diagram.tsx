'use client'

import { useState } from 'react'
import { ArrowRight, Database, Server, Globe, Shield, Zap, Code, FileText } from 'lucide-react'

export function ArchitectureDiagram() {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Main Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-16">
        {/* Frontend */}
        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('frontend')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Frontend</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Next.js 15 + TypeScript</p>
            <p>Drag & Drop Interface</p>
            <p>Real-time Progress</p>
            <p>Chunked Transfer</p>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="hidden lg:flex justify-center">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <ArrowRight className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* gRPC Gateway */}
        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('gateway')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <Code className="h-12 w-12 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">gRPC Gateway</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>HTTP/JSON to gRPC</p>
            <p>REST API Endpoints</p>
            <p>CORS Handling</p>
            <p>Protocol Translation</p>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="hidden lg:flex justify-center">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <ArrowRight className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Backend */}
        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('backend')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <Server className="h-12 w-12 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">gRPC Server</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Go 1.21+ Runtime</p>
            <p>Streaming Upload</p>
            <p>InitUpload RPC</p>
            <p>File Processing</p>
          </div>
        </div>
      </div>

      {/* Detailed Component Info */}
      {hoveredComponent && (
        <div className="mb-16 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-500">
          {hoveredComponent === 'frontend' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Frontend Architecture</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Next.js 15 with App Router</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• shadcn/ui components</li>
                    <li>• React Dropzone for file handling</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Drag & drop file upload</li>
                    <li>• Real-time progress tracking</li>
                    <li>• Chunk-based file transfer</li>
                    <li>• File type validation</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {hoveredComponent === 'gateway' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">gRPC Gateway</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Purpose</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Translates HTTP/JSON to gRPC</li>
                    <li>• Provides REST API endpoints</li>
                    <li>• Handles CORS for web clients</li>
                    <li>• Protocol buffer conversion</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Endpoints</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• GET /v1/files/&#123;id&#125; - Download</li>
                    <li>• GET /v1/uploads/&#123;id&#125;/metadata</li>
                    <li>• POST /v1/upload - File upload</li>
                    <li>• Automatic JSON encoding</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {hoveredComponent === 'backend' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Backend Architecture</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Core Services</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• InitUpload: Server-generated UUIDs</li>
                    <li>• UploadFile: Streaming chunk processing</li>
                    <li>• GetUploadedChunks: Progress tracking</li>
                    <li>• DownloadFile: Secure file retrieval</li>
                    <li>• GetUploadMetadata: File information</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Security Features</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Server-owned file IDs prevent collisions</li>
                    <li>• Path sanitization with filepath.Base()</li>
                    <li>• Chunk bounds validation</li>
                    <li>• TLS encryption support</li>
                    <li>• Atomic file operations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Storage Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('postgres')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <Database className="h-10 w-10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">PostgreSQL</h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Upload Metadata</p>
            <p>User Records</p>
            <p>File Status</p>
            <p>Constraints & Indices</p>
          </div>
        </div>

        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('redis')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <Zap className="h-10 w-10 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Redis</h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Chunk Tracking Sets</p>
            <p>O(1) Operations</p>
            <p>24h TTL Cleanup</p>
            <p>Progress Cache</p>
          </div>
        </div>

        <div 
          className="text-center space-y-4 group cursor-pointer transition-all duration-500 hover:scale-105"
          onMouseEnter={() => setHoveredComponent('storage')}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
            <FileText className="h-10 w-10 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">File Storage</h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Temp Chunks</p>
            <p>Final Files</p>
            <p>Atomic Merge</p>
            <p>Auto Cleanup</p>
          </div>
        </div>
      </div>

      {/* Storage Details */}
      {(hoveredComponent === 'postgres' || hoveredComponent === 'redis' || hoveredComponent === 'storage') && (
        <div className="mt-8 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-500">
          {hoveredComponent === 'postgres' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">PostgreSQL Database</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Schema</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• file_id (UUID PRIMARY KEY)</li>
                    <li>• user_id, file_name, total_chunks</li>
                    <li>• status (in_progress|completed|failed)</li>
                    <li>• stored_path, created_at</li>
                    <li>• size_bytes, mime_type, sha256</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Optimizations</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Status constraints for data integrity</li>
                    <li>• Index on (user_id, created_at DESC)</li>
                    <li>• Connection pooling</li>
                    <li>• Prepared statements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {hoveredComponent === 'redis' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Redis Caching Layer</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Data Structures</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Sets: upload:&#123;file_id&#125;:chunks</li>
                    <li>• SADD for O(1) chunk marking</li>
                    <li>• SMEMBERS for O(1) retrieval</li>
                    <li>• EXPIRE for automatic cleanup</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• No KEYS command (O(N) avoided)</li>
                    <li>• 24-hour TTL prevents memory leaks</li>
                    <li>• Pipeline operations for efficiency</li>
                    <li>• Idempotent chunk tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {hoveredComponent === 'storage' && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">File Storage System</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Structure</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• ./storage/tmp/&#123;file_id&#125;/chunk_&#123;i&#125;</li>
                    <li>• ./storage/files/&#123;file_id&#125;_&#123;name&#125;</li>
                    <li>• Sanitized filenames</li>
                    <li>• Secure permissions (0755/0644)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Operations</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Index-driven merge validation</li>
                    <li>• Atomic rename for consistency</li>
                    <li>• Gap detection before merge</li>
                    <li>• Automatic temp cleanup</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}