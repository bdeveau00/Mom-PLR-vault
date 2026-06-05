import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NavLinks } from '@/components/NavLinks'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-brand-green-light">
      <header className="bg-white border-b border-brand-lavender/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Image 
                  src="/brand/logo.png" 
                  alt="MomIncome Vault" 
                  width={180} 
                  height={50} 
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <NavLinks />
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</span>
                <span className="text-sm font-bold text-brand-dark">{user.email}</span>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
