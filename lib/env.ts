// Fail-loud env access. Call at request time (never at module top level, or
// `next build` will throw before env is available). Returns the value or
// throws a clear, actionable error.
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Add it to .env.local (see .env.example).`)
  }
  return value
}
