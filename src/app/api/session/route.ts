import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  const session = await getServerSession(authOptions)
  const cookieStore = cookies()
  
  // Get all cookies
  const allCookies = cookieStore.getAll()
  
  return NextResponse.json({
    session,
    hasSession: !!session,
    isAdmin: session?.user?.isAdmin || false,
    cookies: allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
    timestamp: new Date().toISOString()
  })
}
