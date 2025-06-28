import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminLogger } from '@/lib/admin-logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const verified = searchParams.get('verified') || 'all'
    const status = searchParams.get('status') || 'all'
    const subscription = searchParams.get('subscription') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // Search query
    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } },
        { lastIp: { contains: query } },
      ]
    }

    // Status filter
    if (status === 'active') where.banned = false
    if (status === 'banned') where.banned = true
    if (status === 'inactive') where.isOnline = false

    // Build the query
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          profile: {
            include: {
              photos: {
                where: { isPrimary: true },
                take: 1
              }
            }
          },
          verification: true,
          subscription: true,
        }
      }),
      prisma.user.count({ where })
    ])

    // Filter by verification status after fetching (for complex conditions)
    let filteredUsers = users
    if (verified === 'verified') {
      filteredUsers = users.filter(u => u.verification?.emailVerified || u.verification?.photoVerified)
    } else if (verified === 'unverified') {
      filteredUsers = users.filter(u => !u.verification?.emailVerified && !u.verification?.photoVerified)
    } else if (verified === 'admin-verified') {
      filteredUsers = users.filter(u => u.verification?.adminVerified)
    }

    // Filter by subscription
    if (subscription !== 'all') {
      filteredUsers = filteredUsers.filter(u => 
        u.subscription?.tier?.toLowerCase() === subscription.toLowerCase()
      )
    }

    return NextResponse.json({
      users: filteredUsers,
      total,
      page,
      hasMore: skip + limit < total
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
