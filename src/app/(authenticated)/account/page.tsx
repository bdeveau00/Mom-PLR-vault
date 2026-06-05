import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Download, History, User, CheckCircle2, Clock } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get download history
  const { data: downloads } = await supabase
    .from('downloads')
    .select(`
      id,
      downloaded_at,
      content_assets (
        title,
        category
      )
    `)
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(10)

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
        <p className="text-gray-500 mt-1">Manage your profile and subscription settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2rem] border border-brand-lavender/30 shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-brand-green-light rounded-2xl">
                <User className="h-6 w-6 text-brand-green-dark" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                <p className="font-bold text-brand-dark">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</p>
                <p className="font-bold text-brand-dark">{profile?.name || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-brand-lavender/30 shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-brand-lavender-light rounded-2xl">
                <CreditCard className="h-6 w-6 text-brand-lavender-dark" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
            </div>
            {subscription ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${subscription.status === 'active' || subscription.status === 'lifetime' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <p className="font-bold text-brand-dark uppercase text-sm">{subscription.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Plan</p>
                    <p className="font-bold text-brand-green-dark uppercase text-sm">{subscription.plan_type}</p>
                  </div>
                </div>
                
                {subscription.plan_type === 'monthly' && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  </div>
                )}

                <form action="/api/portal" method="POST">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center py-3 px-4 border-2 border-brand-lavender rounded-xl text-sm font-bold text-brand-lavender-dark bg-white hover:bg-brand-lavender-light transition-all"
                  >
                    Manage Billing
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-6 italic">No active subscription found.</p>
                <Link
                  href="/#pricing"
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-green hover:bg-brand-green-dark shadow-lg shadow-brand-green/20 transition-all"
                >
                  Choose a Plan
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Download History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-brand-lavender/30 shadow-sm p-8 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-brand-green-light rounded-2xl">
                <History className="h-6 w-6 text-brand-green-dark" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            
            {downloads && downloads.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-brand-green-light/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Asset Name</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Downloaded On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {downloads.map((download: any) => (
                      <tr key={download.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-dark group-hover:text-brand-green-dark transition-colors">
                          {download.content_assets.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            {download.content_assets.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {new Date(download.downloaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Download className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-400 font-medium">No download history yet.</p>
                <Link href="/dashboard" className="text-brand-green-dark font-bold text-sm hover:underline mt-2 inline-block">
                  Browse the Vault
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
