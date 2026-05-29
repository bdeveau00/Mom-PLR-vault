import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { FileText, Mail, BookOpen, MessageSquare, Camera, Video, GraduationCap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DownloadButton } from '@/components/DownloadButton'

export default async function AssetDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // Get asset
  const { data: asset } = await supabase
    .from('content_assets')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!asset) {
    notFound()
  }

  // Check access
  const { data: { user } } = await supabase.auth.getUser()
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id)
    .in('status', ['active', 'trialing'])
    .single()

  const hasAccess = !!subscription || (subscription as any)?.plan_type === 'lifetime'

  if (!hasAccess) {
    redirect('/dashboard')
  }

  const categories: Record<string, any> = {
    ebook: { icon: BookOpen, color: 'text-blue-500' },
    email: { icon: Mail, color: 'text-yellow-500' },
    workbook: { icon: FileText, color: 'text-purple-500' },
    prompts: { icon: MessageSquare, color: 'text-green-500' },
    social: { icon: Camera, color: 'text-pink-500' },
    reels: { icon: Video, color: 'text-red-500' },
    course: { icon: GraduationCap, color: 'text-indigo-500' },
  }

  const CategoryIcon = categories[asset.category]?.icon || FileText
  const categoryColor = categories[asset.category]?.color || 'text-gray-500'

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-pink-600 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Link>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg bg-gray-50 ${categoryColor}`}>
              <CategoryIcon className="h-8 w-8" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {asset.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{asset.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{asset.description}</p>
          
          <div className="border-t pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Download Assets</h3>
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded border">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{asset.title}</p>
                  <p className="text-sm text-gray-500">{asset.file_type || 'PDF/DOCX'} • {asset.month ? `Month ${asset.month}` : 'Bonus'}</p>
                </div>
              </div>
              <DownloadButton 
                assetId={asset.id} 
                assetSlug={asset.slug} 
                assetTitle={asset.title} 
                fileUrl={asset.file_url}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
