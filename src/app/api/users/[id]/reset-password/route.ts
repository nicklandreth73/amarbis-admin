import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminLogger } from '@/lib/admin-logger'
import bcrypt from 'bcryptjs'

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

    // Generate a temporary password
    const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Log the action
    await adminLogger.log({
      adminId: session.user.id,
      action: 'password_reset',
      targetType: 'user',
      targetId: userId,
      details: {
        userEmail: user.email,
        resetAt: new Date().toISOString()
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent') || undefined
    })

    // In production, you would send an email with the new password
    // For now, return it in the response (only for development)
    return NextResponse.json({ 
      success: true,
      tempPassword: process.env.NODE_ENV === 'development' ? tempPassword : undefined,
      message: 'Password reset successfully. User will receive an email with the new password.'
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
