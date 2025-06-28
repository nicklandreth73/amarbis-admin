import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Skip middleware for login page
    if (req.nextUrl.pathname === '/login') {
      return NextResponse.next()
    }

    const token = req.nextauth.token
    
    // Check if user is admin
    if (!token?.isAdmin) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Add security headers
    const headers = new Headers(req.headers)
    headers.set('X-Frame-Options', 'DENY')
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-XSS-Protection', '1; mode=block')
    
    return NextResponse.next({
      request: {
        headers,
      },
    })
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to these paths without authentication
        const publicPaths = ['/login', '/auth/error', '/api/auth']
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )
        
        if (isPublicPath) {
          return true
        }
        
        // Require token for all other pages
        return !!token
      }
    },
    pages: {
      signIn: '/login',
      error: '/auth/error'
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
