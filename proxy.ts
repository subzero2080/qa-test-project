import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Next.js 16 renamed `middleware` to `proxy` — the exported function MUST be
// named `proxy`.
//
// Routes reachable without a session. `/` and `/pricing` are public via the
// exact `/` rule and the prefix list below.
const PUBLIC_PATHS = ['/login', '/signup', '/verify', '/forgot-password', '/reset-password', '/pricing', '/about', '/privacy', '/terms', '/checkout', '/auth', '/api/billing/webhook', '/api/auth', '/api/public']

function isPublic(pathname: string) {
  // Exact match for '/' — never `startsWith('/')`, which would make every
  // route public and defeat the auth gate.
  if (pathname === '/') return true
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Redirect authed users away from auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // Protect app routes
  if (!user && !isPublic(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
