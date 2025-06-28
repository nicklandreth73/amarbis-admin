import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get users that are not admin verified but have completed profiles
    const users = await prisma.user.findMany({
      where: {
        banned: false,
        profile: {
          isNot: null,
          completedOnboarding: true
        },
        OR: [
          { verification: null },
          { 
            verification: {
              adminVerified: false
            }
          }
        ]
      },
      include: {
        profile: {
          include: {
            photos: {
              orderBy: { order: 'asc' }
            }
          }
        },
        verification: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching pending verifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending verifications' },
      { status: 500 }
    )
  }
}
