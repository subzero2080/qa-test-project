import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { config } from '@/lib/app-config'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const description = `${config.name} — built from the builder template.`

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: { default: config.name, template: `%s — ${config.name}` },
  description,
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: config.name,
    description,
    url: config.url,
    siteName: config.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.name,
    description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
