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
        className={`inline-flex items-center justify-center py-3 px-8 text-base font-bold rounded-2xl transition-all disabled:opacity-50 shadow-lg ${
          isPDF 
            ? 'border-2 border-pink-600 text-pink-600 bg-white hover:bg-pink-50 shadow-pink-100' 
            : 'border-transparent text-white bg-brand-green hover:bg-brand-green-dark shadow-brand-green/20'
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
        ) : isPDF ? (
          <FileText className="mr-2 h-5 w-5" />
        ) : (
          <Download className="mr-2 h-5 w-5" />
        )}
        Download {format}
      </button>
      
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-2 py-1 rounded">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}
