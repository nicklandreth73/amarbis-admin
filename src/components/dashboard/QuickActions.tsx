'use client'

import Link from 'next/link'
import { 
  Users, 
  FileWarning, 
  Ban, 
  CheckCircle,
  Search,
  Activity
} from 'lucide-react'

const actions = [
  {
    name: 'Search Users',
    description: 'Find and manage user accounts',
    href: '/users',
    icon: Search,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'Review Reports',
    description: 'Handle user reports and complaints',
    href: '/reports?status=pending',
    icon: FileWarning,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    name: 'Verify Accounts',
    description: 'Review verification requests',
    href: '/verification?status=pending',
    icon: CheckCircle,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: 'Manage Bans',
    description: 'View and manage blocked items',
    href: '/blocked',
    icon: Ban,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    name: 'View Analytics',
    description: 'Platform statistics and insights',
    href: '/analytics',
    icon: Activity,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
]

export function QuickActions() {
  return (
    <div className="admin-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="block group"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className={`p-2 rounded-lg text-white ${action.color} transition-colors`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-admin-primary">
                  {action.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
