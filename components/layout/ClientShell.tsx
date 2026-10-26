'use client'

import { AppToast } from './AppToast'

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main
        className="flex-1 overflow-y-auto"
        style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </main>
      <AppToast />
    </>
  )
}
