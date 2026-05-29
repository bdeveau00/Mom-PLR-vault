import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl text-pink-600">MomIncome PLR Vault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-pink-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Ready-to-Sell PLR for the <span className="text-pink-600">Busy Mompreneur</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Save months of content creation. Rebrand and sell high-quality ebooks, email sequences, and course content designed specifically for moms making money online.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-md bg-pink-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-700 disabled:pointer-events-none disabled:opacity-50"
                  href="/signup"
                >
                  Get Instant Access
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col p-6 bg-white border rounded-lg shadow-sm border-gray-200">
                <h3 className="text-2xl font-bold mb-4 text-center">Monthly Membership</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">$37</span>
                  <span className="text-gray-600 ml-1">/mo</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>Instant access to current vault</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>New content added every month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Link
                  href="/signup?plan=monthly"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md bg-pink-600 px-8 text-sm font-medium text-white shadow hover:bg-pink-700 transition-colors"
                >
                  Start Monthly
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-pink-50 border-2 border-pink-500 rounded-lg shadow-lg relative">
                <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Lifetime Access</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">$297</span>
                  <span className="text-gray-600 ml-1">one-time</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>Unlimited lifetime access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>All future updates included</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-pink-600" />
                    <span>No recurring fees</span>
                  </li>
                </ul>
                <Link
                  href="/signup?plan=lifetime"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md bg-pink-600 px-8 text-sm font-medium text-white shadow hover:bg-pink-700 transition-colors"
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 MomIncome PLR Vault. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
