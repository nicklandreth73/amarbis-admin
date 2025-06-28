'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Mail, 
  Key,
  Trash2,
  Eye,
  Shield
} from 'lucide-react'
import { UserActionsModal } from './UserActionsModal'
import { UserDetailsModal } from './UserDetailsModal'
import toast from 'react-hot-toast'

interface UserTableProps {
  searchQuery: string
  filters: any
}

async function fetchUsers(searchQuery: string, filters: any, page: number) {
  const params = new URLSearchParams({
    q: searchQuery,
    page: page.toString(),
    limit: '20',
    ...filters
  })
  
  const response = await fetch(`/api/users?${params}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export function UserTable({ searchQuery, filters }: UserTableProps) {
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionModalUser, setActionModalUser] = useState<any>(null)
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', searchQuery, filters, page],
    queryFn: () => fetchUsers(searchQuery, filters, page),
    keepPreviousData: true,
  })

  const handleQuickAction = async (action: string, userId: string, data?: any) => {
    try {
      const response = await fetch(`/api/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {})
      })
      
      if (!response.ok) throw new Error(`Failed to ${action} user`)
      
      toast.success(`User ${action} successful`)
      refetch()
    } catch (error) {
      toast.error(`Failed to ${action} user`)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-card p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.profile?.photos?.[0]?.url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile.photos[0].url}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              {user.name?.[0] || user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {user.name || 'No name'}
                          {user.verification?.adminVerified && (
                            <div className="group relative">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Admin Verified
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                          {user.profile?.photos && user.profile.photos.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400">
                              • {user.profile.photos.length} photo{user.profile.photos.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        {user.profile?.bio && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {user.profile.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.banned ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Banned
                        </span>
                      ) : user.isOnline ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Offline
                        </span>
                      )}
                      {user.verification?.adminVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.verification?.adminVerified && (
                        <div className="group relative">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Admin Verified
                          </span>
                        </div>
                      )}
                      {user.verification?.emailVerified && (
                        <Mail className="w-4 h-4 text-gray-500" />
                      )}
                      {user.verification?.photoVerified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActionModalUser(user)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        title="More Actions"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data?.total || 0)} of {data?.total || 0} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data?.hasMore}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {actionModalUser && (
        <UserActionsModal
          user={actionModalUser}
          onClose={() => setActionModalUser(null)}
          onAction={(action, data) => {
            handleQuickAction(action, actionModalUser.id, data)
            setActionModalUser(null)
          }}
        />
      )}
    </>
  )
}
