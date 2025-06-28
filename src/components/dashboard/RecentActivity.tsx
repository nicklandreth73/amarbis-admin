'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { 
  User, 
  Shield, 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  Key
} from 'lucide-react'

async function fetchRecentActivity() {
  const response = await fetch('/api/activity/recent')
  if (!response.ok) throw new Error('Failed to fetch activity')
  return response.json()
}

const activityIcons: Record<string, any> = {
  'user_banned': Ban,
  'user_verified': CheckCircle,
  'report_resolved': Shield,
  'password_reset': Key,
  'admin_login': User,
  'user_unbanned': AlertTriangle,
}

const activityColors: Record<string, string> = {
  'user_banned': 'text-red-600 bg-red-100',
  'user_verified': 'text-green-600 bg-green-100',
  'report_resolved': 'text-blue-600 bg-blue-100',
  'password_reset': 'text-purple-600 bg-purple-100',
  'admin_login': 'text-gray-600 bg-gray-100',
  'user_unbanned': 'text-orange-600 bg-orange-100',
}

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="admin-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>
      
      <div className="space-y-3">
        {activities?.length > 0 ? (
          activities.map((activity: any) => {
            const Icon = activityIcons[activity.action] || User
            const colorClass = activityColors[activity.action] || 'text-gray-600 bg-gray-100'
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.admin.name || activity.admin.email}</span>
                    {' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  )
}
