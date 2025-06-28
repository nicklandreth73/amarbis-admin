import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminLogger } from '@/lib/admin-logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Get user details for logging
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, lastIp: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Unban the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        bannedAt: null,
        banReason: null
      }
    })

    // Optionally unblock their IP
    if (user.lastIp) {
      await prisma.blockedItem.deleteMany({
        where: {
          type: 'ip',
          value: user.lastIp
        }
      }).catch(() => {}) // Ignore if not found
    }

    // Log the action
    await adminLogger.log({
      adminId: session.user.id,
      action: 'user_unbanned',
      targetType: 'user',
      targetId: userId,
      details: {
        userEmail: user.email,
        ipUnblocked: user.lastIp
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent') || undefined
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unbanning user:', error)
    return NextResponse.json(
      { error: 'Failed to unban user' },
      { status: 500 }
    )
  }
}
