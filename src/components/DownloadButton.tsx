'use client'

import { createClient } from '@/utils/supabase/client'
import { Download } from 'lucide-react'
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
  const supabase = createClient()

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Track download
      await supabase.from('downloads').insert({
        user_id: user.id,
        asset_id: assetId
      })

      // 2. Get signed URL
      // Use fileUrl from DB, fallback to slug-based name if missing
      const filePath = fileUrl || `${assetSlug}.zip`
      
      const { data, error } = await supabase
        .storage
        .from('plr-assets')
        .createSignedUrl(filePath, 60)

      if (error) throw error

      if (data?.signedUrl) {
        window.location.href = data.signedUrl
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50"
    >
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Preparing...' : 'Download'}
    </button>
  )
}
