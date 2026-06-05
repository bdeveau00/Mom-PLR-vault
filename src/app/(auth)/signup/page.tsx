'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

function SignupFormContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-8">
          We've sent a confirmation link to <span className="font-bold text-brand-dark">{email}</span>.
        </p>
        <div className="mt-6">
          <Link href="/login" className="font-bold text-brand-green-dark hover:text-brand-green transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="text-center flex flex-col items-center">
        <Link href="/">
          <Image 
            src="/brand/logo.png" 
            alt="Logo" 
            width={150} 
            height={45} 
            className="mb-8 h-10 w-auto object-contain"
          />
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h2>
        {plan && (
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-brand-lavender-light text-brand-lavender-dark text-xs font-bold uppercase tracking-wider">
            Selected Plan: {plan}
          </div>
        )}
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSignup}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}
        <div className="rounded-2xl space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 ml-1">Full Name</label>
            <input
              id="full-name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-lavender/50 focus:border-brand-lavender transition-all sm:text-sm"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 ml-1">Email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-lavender/50 focus:border-brand-lavender transition-all sm:text-sm"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 ml-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-lavender/50 focus:border-brand-lavender transition-all sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link href="/login" className="font-bold text-brand-lavender-dark hover:text-brand-lavender transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading signup form...</p>
      </div>
    }>
      <SignupFormContent />
    </Suspense>
  )
}
