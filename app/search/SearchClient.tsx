'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'

// Small static index of the site's pages — enough to make header search real
// without a backend. Add entries here as pages are added.
const PAGES = [
  { title: 'Home', path: '/', keywords: 'home landing overview start get started shell' },
  { title: 'About', path: '/about', keywords: 'about company approach what you get mission' },
  { title: 'Pricing', path: '/pricing', keywords: 'pricing plans cost subscription developer pro billing' },
  { title: 'Privacy Policy', path: '/privacy', keywords: 'privacy data policy gdpr information' },
  { title: 'Terms of Service', path: '/terms', keywords: 'terms service legal agreement conditions' },
]

export default function SearchClient() {
  const params = useSearchParams()
  const q = (params.get('q') || '').trim()
  const needle = q.toLowerCase()

  const results = needle
    ? PAGES.filter(p => `${p.title} ${p.keywords}`.toLowerCase().includes(needle))
    : []

  return (
    <div className="bg-space" style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <main className="mx-auto px-6 pb-20 pt-10" style={{ maxWidth: 720 }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Search
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {q ? (
            <>
              {results.length} result{results.length === 1 ? '' : 's'} for{' '}
              <span style={{ color: 'var(--text-secondary)' }}>&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            'Type a query in the header search box.'
          )}
        </p>

        <ul className="mt-8 space-y-3">
          {results.map(r => (
            <li key={r.path}>
              <Link
                href={r.path}
                className="glass glass-hover block rounded-xl p-4"
                style={{ color: 'var(--text-primary)' }}
              >
                <span className="font-semibold">{r.title}</span>
                <span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {r.path}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {q && results.length === 0 && (
          <p className="mt-8" style={{ color: 'var(--text-secondary)' }}>
            No pages matched. Try a different term.
          </p>
        )}
      </main>
    </div>
  )
}
