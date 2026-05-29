import { createClient } from '@/utils/supabase/server'
import { FileText, Mail, BookOpen, MessageSquare, Camera, Video, GraduationCap, Download, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export async function DashboardContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const session_id = searchParams.session_id
  
  // Get content assets
  const { data: assets } = await supabase
    .from('content_assets')
    .select('*')
    .order('created_at', { ascending: false })

  // Check subscription status
  const { data: { user } } = await supabase.auth.getUser()
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id)
    .in('status', ['active', 'trialing'])
    .single()

  const hasAccess = !!subscription || (subscription as any)?.plan_type === 'lifetime'

  const categories: Record<string, any> = {
    ebook: { icon: BookOpen, color: 'text-blue-500' },
    email: { icon: Mail, color: 'text-yellow-500' },
    workbook: { icon: FileText, color: 'text-purple-500' },
    prompts: { icon: MessageSquare, color: 'text-green-500' },
    social: { icon: Camera, color: 'text-pink-500' },
    reels: { icon: Video, color: 'text-red-500' },
    course: { icon: GraduationCap, color: 'text-indigo-500' },
  }

  return (
    <>
      {session_id && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-400 mr-3" />
            <p className="text-sm text-green-700">
              Payment successful! Welcome to the vault. Your access has been activated.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Content Vault</h1>
      </div>

      {!hasAccess && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                You don't have an active subscription. 
                <Link href="/#pricing" className="font-medium underline ml-1">
                  Upgrade now to unlock the vault.
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets && assets.length > 0 ? (
          assets.map((asset) => {
            const CategoryIcon = categories[asset.category]?.icon || FileText
            const categoryColor = categories[asset.category]?.color || 'text-gray-500'

            return (
              <div key={asset.id} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gray-50 ${categoryColor}`}>
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {asset.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{asset.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{asset.description}</p>
                  
                  {hasAccess ? (
                    <Link
                      href={`/dashboard/${asset.slug}`}
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      View & Download
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-200 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No content assets available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  )
}
