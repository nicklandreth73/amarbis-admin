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

    const { reason } = await request.json()
    const userId = params.id

    // Get user details for logging
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, lastIp: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ban the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        bannedAt: new Date(),
        banReason: reason || 'Admin action'
      }
    })

    // Block their IP if available
    if (user.lastIp) {
      await prisma.blockedItem.create({
        data: {
          type: 'ip',
          value: user.lastIp,
          reason: `Auto-blocked: User ${user.email} banned`,
          blockedBy: session.user.id
        }
      }).catch(() => {}) // Ignore if IP already blocked
    }

    // Log the action
    await adminLogger.log({
      adminId: session.user.id,
      action: 'user_banned',
      targetType: 'user',
      targetId: userId,
      details: {
        userEmail: user.email,
        reason,
        ipBlocked: user.lastIp
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent') || undefined
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error banning user:', error)
    return NextResponse.json(
      { error: 'Failed to ban user' },
      { status: 500 }
    )
  }
}
