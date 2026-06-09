import { createClient } from '@/utils/supabase/server'
import { FileText, Mail, BookOpen, MessageSquare, Camera, Video, GraduationCap, Download, CheckCircle2, Lock } from 'lucide-react'
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
    .in('status', ['active', 'trialing', 'lifetime'])
    .single()

  const hasAccess = !!subscription

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
        <div className="bg-brand-green-light border-l-4 border-brand-green p-6 rounded-r-2xl mb-10 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-brand-green rounded-full flex items-center justify-center mr-4">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Payment Successful!</h3>
              <p className="text-sm text-gray-600">
                Welcome to the vault. Your access has been activated. Start exploring your new content below!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Content Vault</h1>
          <p className="text-gray-500 mt-1">Access all your premium PLR assets in one place.</p>
        </div>
        {!hasAccess && (
          <Link href="/#pricing" className="px-6 py-3 bg-brand-lavender text-brand-lavender-dark font-bold rounded-xl hover:bg-brand-lavender-dark hover:text-white transition-all shadow-sm">
            Upgrade for Access
          </Link>
        )}
      </div>

      {!hasAccess && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-10 flex items-center">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-amber-800 font-medium">
              You're currently viewing the library in preview mode.
            </p>
            <p className="text-sm text-amber-700">
              Join the membership to unlock high-quality downloads and start selling today.
              <Link href="/#pricing" className="font-bold underline ml-2 decoration-2 underline-offset-2">
                See Pricing Plans
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets && assets.length > 0 ? (
          assets.map((asset) => {
            const CategoryIcon = categories[asset.category]?.icon || FileText
            const categoryColor = categories[asset.category]?.color || 'text-gray-500'

            return (
              <div key={asset.id} className="bg-white rounded-[2rem] border border-brand-lavender/30 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-green/30 transition-all group flex flex-col">
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-brand-green-light/50 ${categoryColor} group-hover:bg-brand-green-light transition-colors`}>
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {asset.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-green-dark transition-colors line-clamp-1">{asset.title}</h3>
                  <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed flex-1">{asset.description}</p>
                  
                  {hasAccess ? (
                    <Link
                      href={`/dashboard/${asset.slug}`}
                      className="w-full inline-flex items-center justify-center py-4 px-6 border border-transparent text-base font-bold rounded-2xl text-white bg-brand-green hover:bg-brand-green-dark transition-all shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-95"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      View & Download
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center py-4 px-6 border border-gray-100 text-base font-bold rounded-2xl text-gray-400 bg-gray-50 cursor-not-allowed"
                    >
                      <Lock className="mr-2 h-5 w-5" />
                      Locked Content
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vault is being stocked!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Our creators are working hard to bring you the best PLR content. Check back in a few days.</p>
          </div>
        )}
      </div>
    </>
  )
}
