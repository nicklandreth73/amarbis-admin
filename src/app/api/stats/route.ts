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

    // Get total users count
    const totalUsers = await prisma.user.count()
    
    // Get verified users count
    const verifiedUsers = await prisma.userVerification.count({
      where: { adminVerified: true }
    })
    
    // Get active reports count
    const activeReports = await prisma.report.count({
      where: { status: 'PENDING' }
    })
    
    // Get monthly revenue (subscriptions active this month)
    const activeSubscriptions = await prisma.userSubscription.count({
      where: {
        status: 'ACTIVE',
        tier: { in: ['PREMIUM', 'GOLD'] }
      }
    })
    
    // Calculate rough monthly revenue (example rates)
    const monthlyRevenue = (activeSubscriptions * 29.99).toFixed(2)
    
    // Get growth metrics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })
    
    const userGrowth = totalUsers > 0 
      ? `+${((newUsersLastMonth / totalUsers) * 100).toFixed(1)}%`
      : '+0%'
    
    const verificationRate = totalUsers > 0
      ? ((verifiedUsers / totalUsers) * 100).toFixed(1)
      : 0

    return NextResponse.json({
      totalUsers,
      verifiedUsers,
      activeReports,
      monthlyRevenue,
      userGrowth,
      verificationRate,
      reportsChange: '+2',
      revenueGrowth: '+12.5%'
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
