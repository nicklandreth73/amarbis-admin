import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.isAdmin) {
    return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3003'))
  } else {
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3003'))
  }
}
