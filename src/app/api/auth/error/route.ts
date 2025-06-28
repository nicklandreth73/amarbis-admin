import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  
  // Redirect to login page with error
  return NextResponse.redirect(new URL(`/login?error=${error || 'unknown'}`, request.url))
}
