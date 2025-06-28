import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminLogger } from '@/lib/admin-logger'

const actionDescriptions: Record<string, (details: any) => string> = {
  'admin_login': () => 'logged into admin dashboard',
  'user_banned': (details) => `banned user ${details.userEmail}`,
  'user_unbanned': (details) => `unbanned user ${details.userEmail}`,
  'user_verified': (details) => `verified user ${details.userEmail}`,
  'password_reset': (details) => `reset password for ${details.userEmail}`,
  'report_resolved': (details) => `resolved report #${details.reportId}`,
  'ip_blocked': (details) => `blocked IP address ${details.ip}`,
  'device_blocked': (details) => `blocked device ${details.deviceId}`,
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recentLogs = await adminLogger.getRecentLogs(20)
    
    const activities = recentLogs.map(log => ({
      id: log.id,
      action: log.action,
      description: actionDescriptions[log.action]?.(log.details) || log.action,
      admin: log.admin,
      createdAt: log.createdAt,
      targetId: log.targetId,
      targetType: log.targetType
    }))

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
