'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Library' },
    { href: '/account', label: 'Account' },
  ]

  return (
    <nav className="ml-10 flex space-x-2">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
        // Special case for dashboard to not match everything
        const isDashboardActive = link.href === '/dashboard' && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))
        
        const active = link.href === '/dashboard' ? isDashboardActive : isActive

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              active
                ? 'text-brand-dark bg-brand-lavender-light border-b-2 border-brand-lavender shadow-sm'
                : 'text-gray-500 hover:text-brand-lavender-dark hover:bg-brand-lavender-light/50'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
