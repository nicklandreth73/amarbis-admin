import { prisma } from '@/lib/prisma'

interface LogOptions {
  adminId: string
  action: string
  targetType: string
  targetId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
}

class AdminLogger {
  async log(options: LogOptions) {
    try {
      await prisma.adminLog.create({
        data: {
          adminId: options.adminId,
          action: options.action,
          targetType: options.targetType,
          targetId: options.targetId,
          details: options.details || {},
          ipAddress: options.ipAddress,
          userAgent: options.userAgent,
        }
      })
    } catch (error) {
      console.error('Failed to log admin action:', error)
    }
  }

  async getRecentLogs(limit = 50) {
    return prisma.adminLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
  }

  async getLogsByAdmin(adminId: string, limit = 50) {
    return prisma.adminLog.findMany({
      where: { adminId },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }

  async getLogsByTarget(targetId: string, limit = 50) {
    return prisma.adminLog.findMany({
      where: { targetId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
  }
}

export const adminLogger = new AdminLogger()
