'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Sun, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/app-config'

type Props = {
  userEmail: string
}

const NAV = [
  { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/settings',  icon: Settings,        label: 'Settings' },
]

export function Sidebar({ userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)

  function toggleDark() {
    setDarkMode(d => {
      const next = !d
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className="flex flex-col h-screen shrink-0 transition-glass"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--container-glass)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderRight: '1px solid var(--border-glass)',
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <Image src="/logo.svg" alt={APP_NAME} width={28} height={28} style={{ objectFit: 'contain' }} />
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {APP_NAME}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200"
              style={{
                color: active ? 'var(--accent-neon)' : 'var(--text-secondary)',
                background: active ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--border-glass)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom utilities */}
      <div className="px-3 pb-4 space-y-0.5" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
        {/* Dark/light toggle */}
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200"
          style={{ color: 'var(--text-muted)', background: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.background = 'var(--border-glass)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '8px', marginTop: '4px' }}>
          <div className="flex items-center gap-2 px-3 py-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'var(--accent-neon)', color: '#0b0e14' }}
            >
              {userEmail?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--status-failed)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
