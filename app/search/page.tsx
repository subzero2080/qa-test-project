import { Suspense } from 'react'
import { config } from '@/lib/app-config'
import SearchClient from './SearchClient'

export const metadata = { title: `Search — ${config.name}` }

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  )
}
