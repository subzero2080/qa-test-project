'use client'

import { Check, Loader2 } from 'lucide-react'

export type ProcessStep = {
  id: string
  label: string
  status: 'pending' | 'active' | 'done'
}

type Props = {
  open: boolean
  title: string
  steps: ProcessStep[]
}

/**
 * Full-screen glassmorphism loading modal for long-running background tasks.
 * Reuse this anywhere a task has distinct phases the user should see.
 *
 * Usage:
 *   const [steps, setSteps] = useState<ProcessStep[]>([
 *     { id: 'generate', label: 'Generating ideas…',         status: 'pending' },
 *     { id: 'enrich',   label: 'Fetching search volume…',   status: 'pending' },
 *   ])
 *   // set status to 'active' when a step starts, 'done' when it finishes
 *   <ProcessModal open={isRunning} title="My Task" steps={steps} />
 */
export function ProcessModal({ open, title, steps }: Props) {
  if (!open) return null

  const activeStep = steps.find(s => s.status === 'active')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(11,14,20,0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Card */}
      <div
        style={{
          position: 'relative',
          width: '420px',
          padding: '36px 40px 40px',
          borderRadius: '16px',
          background: 'rgba(22,27,34,0.92)',
          border: '1px solid rgba(0,212,255,0.25)',
          boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 0 120px rgba(0,212,255,0.04), 0 32px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Corner accents */}
        <Corner position="top-left" />
        <Corner position="top-right" />
        <Corner position="bottom-left" />
        <Corner position="bottom-right" />

        {/* Title */}
        <p style={{
          margin: '0 0 32px',
          fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: 'var(--accent-neon)',
        }}>
          {title}
        </p>

        {/* Spinner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            {/* Glow ring */}
            <div style={{
              position: 'absolute', inset: '-4px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
            }} />
            {/* Spinner */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '2px solid rgba(0,212,255,0.12)',
              borderTop: '2px solid var(--accent-neon)',
              animation: 'spin 0.9s linear infinite',
              boxShadow: '0 0 16px rgba(0,212,255,0.3)',
            }} />
          </div>
        </div>

        {/* Active step label */}
        <p style={{
          margin: '0 0 28px', textAlign: 'center',
          fontSize: '14px', color: 'var(--text-secondary)',
          minHeight: '20px',
        }}>
          {activeStep?.label ?? ''}
        </p>

        {/* Steps list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steps.map(step => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Status dot / check */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.status === 'done'
                  ? 'rgba(34,197,94,0.15)'
                  : step.status === 'active'
                  ? 'rgba(0,212,255,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  step.status === 'done'
                    ? 'rgba(34,197,94,0.4)'
                    : step.status === 'active'
                    ? 'rgba(0,212,255,0.4)'
                    : 'rgba(255,255,255,0.1)'
                }`,
                transition: 'all 0.3s',
              }}>
                {step.status === 'done' && <Check size={11} style={{ color: '#22c55e', strokeWidth: 2.5 }} />}
                {step.status === 'active' && (
                  <Loader2 size={11} style={{ color: 'var(--accent-neon)', animation: 'spin 1s linear infinite' }} />
                )}
              </div>

              <span style={{
                fontSize: '13px',
                color: step.status === 'done'
                  ? '#22c55e'
                  : step.status === 'active'
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Corner({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const size = 14
  const thickness = 2
  const color = 'rgba(0,212,255,0.6)'
  const offset = -1

  const isTop    = position.startsWith('top')
  const isLeft   = position.endsWith('left')

  return (
    <div style={{
      position: 'absolute',
      top:    isTop    ? offset : undefined,
      bottom: !isTop   ? offset : undefined,
      left:   isLeft   ? offset : undefined,
      right:  !isLeft  ? offset : undefined,
      width: size, height: size,
      pointerEvents: 'none',
    }}>
      {/* Horizontal bar */}
      <div style={{
        position: 'absolute',
        top:    isTop ? 0 : undefined,
        bottom: !isTop ? 0 : undefined,
        left:   isLeft ? 0 : undefined,
        right:  !isLeft ? 0 : undefined,
        width: size, height: thickness,
        background: color,
        borderRadius: '1px',
      }} />
      {/* Vertical bar */}
      <div style={{
        position: 'absolute',
        top:    isTop ? 0 : undefined,
        bottom: !isTop ? 0 : undefined,
        left:   isLeft ? 0 : undefined,
        right:  !isLeft ? 0 : undefined,
        width: thickness, height: size,
        background: color,
        borderRadius: '1px',
      }} />
    </div>
  )
}
