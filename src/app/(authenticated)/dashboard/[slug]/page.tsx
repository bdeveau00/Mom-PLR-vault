import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { FileText, Mail, BookOpen, MessageSquare, Camera, Video, GraduationCap, ArrowLeft, Download, FileJson } from 'lucide-react'
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
    .in('status', ['active', 'trialing', 'lifetime'])
    .single()

  const hasAccess = !!subscription

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
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-lavender-dark mb-10 transition-colors">
        <div className="mr-2 p-2 rounded-xl bg-white border border-gray-100 group-hover:border-brand-lavender/50 shadow-sm transition-all">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Library
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-brand-lavender/30 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl bg-brand-green-light/50 ${categoryColor}`}>
                <CategoryIcon className="h-10 w-10" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block mb-1">
                  {asset.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{asset.title}</h1>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600 mb-12">
            <p className="text-xl leading-relaxed">{asset.description}</p>
          </div>
          
          <div className="border-t border-brand-lavender/20 pt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Download className="mr-2 h-6 w-6 text-brand-green" />
              Ready to Download
            </h3>
            
            <div className="space-y-4">
              {/* PDF Version */}
              <div className="bg-brand-green-light/30 border border-brand-green/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-green/10">
                    <FileText className="h-8 w-8 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-dark mb-1">{asset.title} (Professional PDF)</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-wider">
                        High Quality
                      </span>
                      <span className="text-sm font-bold text-gray-400">
                        {asset.month ? `Month ${asset.month}` : 'Bonus Pack'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DownloadButton 
                  assetId={asset.id} 
                  assetSlug={asset.slug} 
                  assetTitle={asset.title} 
                  fileUrl={asset.file_url_pdf || asset.file_url?.replace('month1/', 'month1-pdf/').replace('.md', '.pdf')}
                  format="PDF"
                />
              </div>

              {/* Editable Version */}
              <div className="bg-brand-lavender-light/30 border border-brand-lavender/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-lavender/10">
                    <FileJson className="h-8 w-8 text-brand-lavender-dark" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-dark mb-1">{asset.title} (Editable Markdown)</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-brand-lavender-light text-brand-lavender-dark text-[10px] font-black uppercase tracking-wider">
                        Rebrandable
                      </span>
                      <span className="text-sm font-bold text-gray-400">
                        Raw Text File
                      </span>
                    </div>
                  </div>
                </div>
                
                <DownloadButton 
                  assetId={asset.id} 
                  assetSlug={asset.slug} 
                  assetTitle={asset.title} 
                  fileUrl={asset.file_url}
                  format="Markdown"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
