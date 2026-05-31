'use client'

import { Download, AlertCircle, Loader2, FileText, File } from 'lucide-react'
import { useState } from 'react'

export function DownloadButton({ 
  assetId, 
  assetSlug, 
  assetTitle,
  fileUrl
}: { 
  assetId: string, 
  assetSlug: string, 
  assetTitle: string,
  fileUrl?: string
}) {
  const [loading, setLoading] = useState<string | null>(null) // 'md' or 'pdf'
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (format: 'md' | 'pdf') => {
    setLoading(format)
    setError(null)
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          fileUrl: fileUrl || `${assetSlug}.md`,
          format
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate download link')
      }

      if (data.signedUrl) {
        const link = document.createElement('a')
        link.href = data.signedUrl
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error('No download URL returned')
      }
    } catch (err: any) {
      console.error('Download error:', err)
      setError(err.message || 'Download failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const isMarkdown = fileUrl?.endsWith('.md') || !fileUrl?.includes('.')

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex space-x-2">
        {isMarkdown && (
          <button
            onClick={() => handleDownload('pdf')}
            disabled={!!loading}
            className="inline-flex items-center justify-center py-2 px-4 border border-pink-600 text-sm font-medium rounded-md text-pink-600 bg-white hover:bg-pink-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading === 'pdf' ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            PDF
          </button>
        )}
        
        <button
          onClick={() => handleDownload('md')}
          disabled={!!loading}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading === 'md' ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isMarkdown ? 'Markdown' : 'Download Now'}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}
