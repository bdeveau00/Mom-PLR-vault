import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Download, History, User } from 'lucide-react'

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
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{profile?.name || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="h-6 w-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
          </div>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="font-medium text-gray-900 uppercase">{subscription.plan_type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.status}
                </span>
              </div>
              {subscription.plan_type === 'monthly' && (
                <div>
                  <p className="text-sm text-gray-500">Next Billing Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              )}
              <form action="/api/portal" method="POST">
                <button
                  type="submit"
                  className="w-full mt-4 inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Manage Billing
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No active subscription found.</p>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
              >
                Choose a Plan
              </Link>
            </div>
          )}
        </div>

        {/* Download History */}
        <div className="bg-white rounded-xl border shadow-sm p-6 md:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <History className="h-6 w-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Recent Downloads</h2>
          </div>
          {downloads && downloads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {downloads.map((download: any) => (
                    <tr key={download.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{download.content_assets.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{download.content_assets.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(download.downloaded_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">You haven't downloaded any assets yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
