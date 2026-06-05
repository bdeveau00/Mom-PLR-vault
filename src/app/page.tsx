import Link from 'next/link'
import Image from 'next/image'
import { Check, Sparkles, BookOpen, Clock, Download } from 'lucide-react'
import { WildFlower } from '@/components/WildFlower'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-brand-dark">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-brand-lavender/30 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Image 
            src="/brand/logo.png" 
            alt="MomIncome PLR Vault" 
            width={200} 
            height={60} 
            className="h-12 w-auto object-contain"
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-semibold hover:text-brand-green-dark transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold hover:text-brand-green-dark transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link 
            className="text-sm font-bold px-4 py-2 rounded-full bg-brand-green text-white hover:bg-brand-green-dark transition-colors" 
            href="/login"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-40 bg-brand-green-light overflow-hidden">
          {/* Decorative Flowers */}
          <WildFlower type="daisy" className="absolute top-10 left-[5%] w-24 h-24 opacity-20 rotate-12" />
          <WildFlower type="lavender" className="absolute bottom-10 left-[10%] w-32 h-32 opacity-20 -rotate-12" />
          <WildFlower type="leaf" className="absolute top-20 right-[5%] w-20 h-20 opacity-20 rotate-45" />
          <WildFlower type="daisy" className="absolute bottom-20 right-[10%] w-28 h-28 opacity-20 -rotate-12" />
          
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <div className="flex flex-col items-center space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-green/20 text-brand-green-dark text-sm font-bold mb-4">
                  DONE-FOR-YOU CONTENT
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                  Ready-to-Sell PLR for the <br />
                  <span className="text-brand-green-dark">Busy Mompreneur</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-2xl/relaxed">
                  Save months of content creation. Rebrand and sell high-quality ebooks, email sequences, and course content designed specifically for moms making money online.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-full bg-brand-green px-10 text-lg font-bold text-white shadow-lg transition-all hover:bg-brand-green-dark hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                  href="/signup"
                >
                  Get Instant Access
                </Link>
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white border-2 border-brand-lavender px-10 text-lg font-bold text-brand-lavender-dark shadow-sm transition-all hover:bg-brand-lavender-light hover:scale-105"
                  href="#pricing"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Everything You Need to Scale</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">High-quality, professional assets you can put your name on today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Ebooks & Workbooks', icon: BookOpen, desc: 'Comprehensive guides ready for your branding.' },
                { title: 'Email Sequences', icon: Sparkles, desc: 'Nurture your leads with pre-written copy.' },
                { title: 'Social Media Assets', icon: Download, desc: 'Reel scripts and post templates that convert.' },
                { title: 'Monthly Drops', icon: Clock, desc: 'Fresh content delivered to your vault every month.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col p-8 bg-brand-lavender-light rounded-3xl border border-brand-lavender/50 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand-lavender transition-colors">
                    <item.icon className="w-6 h-6 text-brand-lavender-dark group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-20 bg-brand-lavender-light/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-center">Choose Your Path</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Join hundreds of moms building their digital empires.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col p-8 bg-white border border-brand-lavender rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-2">Monthly Membership</h3>
                <p className="text-gray-500 mb-6">Perfect for growing businesses.</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$37</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    'Full access to current PLR vault',
                    'New monthly content drops',
                    'Commercial use license',
                    'Cancel anytime',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-700">
                      <div className="mr-3 p-1 rounded-full bg-brand-green/20">
                        <Check className="h-4 w-4 text-brand-green-dark" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=monthly"
                  className="w-full inline-flex h-12 items-center justify-center rounded-full bg-white border-2 border-brand-green text-brand-green-dark text-lg font-bold shadow-sm hover:bg-brand-green hover:text-white transition-all"
                >
                  Start Monthly
                </Link>
              </div>
              <div className="flex flex-col p-8 bg-brand-green-light border-2 border-brand-green rounded-3xl shadow-2xl relative overflow-hidden transform md:scale-105">
                <div className="absolute top-0 right-0 bg-brand-green text-white px-6 py-2 text-sm font-bold rounded-bl-3xl">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
                <p className="text-gray-600 mb-6">The ultimate investment for your brand.</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$297</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    'Unlimited lifetime access',
                    'All future updates included',
                    'Premium support',
                    'Exclusive "First Look" at new assets',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-800 font-medium">
                      <div className="mr-3 p-1 rounded-full bg-brand-green/40">
                        <Check className="h-4 w-4 text-brand-green-dark" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=lifetime"
                  className="w-full inline-flex h-12 items-center justify-center rounded-full bg-brand-green text-white text-lg font-bold shadow-lg hover:bg-brand-green-dark transition-all"
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="relative w-full py-12 bg-brand-green-light/50 border-t border-brand-green/20 overflow-hidden">
        {/* Subtle flowers in footer */}
        <WildFlower type="leaf" className="absolute top-5 right-[5%] w-12 h-12 opacity-10 rotate-12" />
        <WildFlower type="daisy" className="absolute bottom-5 left-[5%] w-10 h-10 opacity-10 -rotate-12" />
        
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Image 
                src="/brand/logo.png" 
                alt="MomIncome PLR Vault" 
                width={150} 
                height={45} 
                className="h-10 w-auto grayscale opacity-70"
              />
              <p className="text-sm text-gray-500">© 2025 MomIncome PLR Vault. All rights reserved.</p>
            </div>
            <nav className="flex gap-6">
              <Link className="text-sm text-gray-600 hover:text-brand-green-dark underline-offset-4" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-600 hover:text-brand-green-dark underline-offset-4" href="#">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
