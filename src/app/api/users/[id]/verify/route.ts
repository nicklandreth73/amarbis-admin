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
    const body = await request.json()
    const { note } = body

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { verification: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has verification record
    if (!user.verification) {
      // Create verification record
      await prisma.userVerification.create({
        data: {
          userId,
          adminVerified: true,
          adminVerifiedAt: new Date(),
          adminVerifiedBy: session.user.id,
          adminVerificationNote: note,
          verificationLevel: 'VERIFIED'
        }
      })
    } else {
      // Toggle admin verification
      const newVerificationStatus = !user.verification.adminVerified
      
      await prisma.userVerification.update({
        where: { userId },
        data: {
          adminVerified: newVerificationStatus,
          adminVerifiedAt: newVerificationStatus ? new Date() : null,
          adminVerifiedBy: newVerificationStatus ? session.user.id : null,
          adminVerificationNote: newVerificationStatus ? note : null,
          verificationLevel: newVerificationStatus ? 'VERIFIED' : 'BASIC'
        }
      })
    }

    // Log the action
    await adminLogger.log({
      adminId: session.user.id,
      action: 'user_verified',
      targetType: 'user',
      targetId: userId,
      details: {
        userEmail: user.email,
        verified: !user.verification?.adminVerified,
        note
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent') || undefined
    })

    return NextResponse.json({ 
      success: true,
      verified: !user.verification?.adminVerified
    })
  } catch (error) {
    console.error('Error verifying user:', error)
    return NextResponse.json(
      { error: 'Failed to verify user' },
      { status: 500 }
    )
  }
}
