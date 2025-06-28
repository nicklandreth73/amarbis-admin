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
      select: { email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete user and all related data in the correct order
    // We need to delete in order of dependencies to avoid foreign key constraints
    
    // 1. Delete messages sent by user
    await prisma.message.deleteMany({
      where: { senderId: userId }
    })
    
    // 2. Delete conversation participants
    await prisma.conversationParticipant.deleteMany({
      where: { userId }
    })
    
    // 3. Delete swipes (both sent and received)
    await prisma.swipe.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    })
    
    // 4. Delete matches (both sent and received)
    await prisma.match.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    })
    
    // 5. Delete reports (both by and against user)
    await prisma.report.deleteMany({
      where: {
        OR: [
          { reporterId: userId },
          { reportedId: userId }
        ]
      }
    })
    
    // 6. Delete blocks (both by and against user)
    await prisma.block.deleteMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId }
        ]
      }
    })
    
    // 7. Delete calls
    await prisma.call.deleteMany({
      where: {
        OR: [
          { callerId: userId },
          { participantId: userId }
        ]
      }
    })
    
    // 8. Delete daily limits
    await prisma.dailyLimit.deleteMany({
      where: { userId }
    })
    
    // 9. Delete weekly usage
    await prisma.weeklyUsage.deleteMany({
      where: { userId }
    })
    
    // 10. Delete ban appeals
    await prisma.banAppeal.deleteMany({
      where: { userId }
    })
    
    // 11. Delete admin logs for this user (optional - you might want to keep these)
    // await prisma.adminLog.deleteMany({
    //   where: { targetId: userId }
    // })
    
    // 12. Finally delete the user (this will cascade delete profile, photos, etc.)
    await prisma.user.delete({
      where: { id: userId }
    })

    // Log the action
    await adminLogger.log({
      adminId: session.user.id,
      action: 'user_deleted',
      targetType: 'user',
      targetId: userId,
      details: {
        userEmail: user.email,
        deletedAt: new Date().toISOString()
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent') || undefined
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
