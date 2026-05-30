'use client'

import { Download, AlertCircle, Loader2 } from 'lucide-react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 1. Call API route to get signed URL
      // This also handles authentication check and download tracking
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          fileUrl: fileUrl || `${assetSlug}.md`
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate download link')
      }

      if (data.signedUrl) {
        // 2. Trigger download
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

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50 shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Preparing...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Now
          </>
        )}
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
