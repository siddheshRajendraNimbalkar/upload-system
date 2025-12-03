'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { Upload, ArrowRight, Shield, Zap, Database, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white"></div>
      </div>
    )
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
            <div className="flex items-center space-x-6">
              <Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Documentation
              </Link>
              <Link href="/upload" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Upload
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Enterprise file uploads,
              <br />
              <span className="text-gray-500 dark:text-gray-400">secured & optimized.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Production-ready file upload system with JWT authentication, 4MB chunks, 
              server-generated UUIDs, and comprehensive security features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <button className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    Try Upload
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </Link>
              <Link href="/docs">
                <button className="group relative px-8 py-4 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <FileText className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    Documentation
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise-grade features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built for scale, security, and performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />JWT Authentication</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Server-generated UUIDs</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Path sanitization</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Atomic operations</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Optimized Performance</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />4MB chunk uploads</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Redis Sets (O(1) ops)</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Idempotent chunks</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Context cancellation</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Production Ready</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Structured logging</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Auto cleanup (24h TTL)</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Database constraints</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />TLS encryption</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Secure Architecture
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Enterprise-grade security with modern performance optimizations
            </p>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Production-ready upload system
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Enterprise security meets optimal performance
          </p>
          <Link href="/upload">
            <button className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                Start Uploading
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>
    </div>
  )
}
