'use client'

import { Download, AlertCircle, Loader2, FileText } from 'lucide-react'
import { useState } from 'react'

export function DownloadButton({ 
  assetId, 
  assetSlug, 
  assetTitle,
  fileUrl,
  format = 'Markdown'
}: { 
  assetId: string, 
  assetSlug: string, 
  assetTitle: string,
  fileUrl?: string,
  format?: 'PDF' | 'Markdown'
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!fileUrl) {
      setError('File URL missing')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          fileUrl,
          // We pass the actual fileUrl from the prop, so /api/download doesn't need to 'format' it
          format: format === 'PDF' ? 'pdf' : 'md'
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
      setLoading(false)
    }
  }

  const isPDF = format === 'PDF'

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center justify-center py-2 px-4 border text-sm font-medium rounded-md transition-colors disabled:opacity-50 shadow-sm ${
          isPDF 
            ? 'border-pink-600 text-pink-600 bg-white hover:bg-pink-50' 
            : 'border-transparent text-white bg-pink-600 hover:bg-pink-700'
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
        ) : isPDF ? (
          <FileText className="mr-2 h-4 w-4" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Download {format}
      </button>
      
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}
