'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
]

/**
 * Shared marketing header. White bar with dark text (independent of the page
 * theme), the primary nav, and a site-wide search box that routes to /search.
 */
export default function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <header
      className="flex items-center justify-between gap-4 px-6 py-4 md:px-10"
      style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      <Link href="/" className="text-lg font-bold tracking-tight whitespace-nowrap" style={{ color: '#18181b' }}>
        {APP_NAME}
      </Link>

      <form onSubmit={onSubmit} role="search" className="flex flex-1 justify-center" style={{ maxWidth: 360, margin: '0 auto' }}>
        <div className="relative w-full">
          <Search
            size={15}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a8a93' }}
          />
          <input
            type="search"
            name="q"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search…"
            aria-label="Search"
            className="w-full text-sm"
            style={{
              padding: '8px 12px 8px 34px',
              borderRadius: 8,
              border: '1px solid #e4e4e7',
              background: '#f7f7f8',
              color: '#18181b',
              outline: 'none',
            }}
          />
        </div>
      </form>

      <nav className="flex items-center gap-5 whitespace-nowrap">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm"
            style={{ color: pathname === item.href ? '#18181b' : '#52525b' }}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/login" className="text-sm" style={{ color: '#52525b' }}>
          Sign in
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium"
          style={{ padding: '8px 16px', borderRadius: 8, background: '#18181b', color: '#ffffff' }}
        >
          Sign up
        </Link>
      </nav>
    </header>
  )
}
