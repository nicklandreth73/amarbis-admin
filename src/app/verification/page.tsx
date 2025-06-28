'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Shield, CheckCircle, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

async function fetchPendingVerifications() {
  const response = await fetch('/api/verification/pending')
  if (!response.ok) throw new Error('Failed to fetch verifications')
  return response.json()
}

async function verifyUser(userId: string, note?: string) {
  const response = await fetch(`/api/users/${userId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  })
  if (!response.ok) throw new Error('Failed to verify user')
  return response.json()
}

export default function VerificationPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [verificationNote, setVerificationNote] = useState('')
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['pending-verifications'],
    queryFn: fetchPendingVerifications,
  })

  const handleVerify = async (userId: string, approve: boolean) => {
    try {
      if (approve) {
        await verifyUser(userId, verificationNote)
        toast.success('User verified successfully')
      } else {
        // Just close without verifying
        toast.info('Verification skipped')
      }
      setSelectedUser(null)
      setVerificationNote('')
      refetch()
    } catch (error) {
      toast.error('Failed to process verification')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and verify user accounts
          </p>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Verifications
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {users?.length || 0} users awaiting verification
            </span>
          </div>

          {users?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user: any) => (
                <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {user.profile?.photos?.[0]?.url ? (
                      <img
                        src={user.profile.photos[0].url}
                        alt=""
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xl text-gray-500 dark:text-gray-400">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name || 'No name'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.profile?.country}, {user.profile?.region}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      {user.verification?.emailVerified && (
                        <span className="text-green-600">✓ Email</span>
                      )}
                      {user.verification?.photoVerified && (
                        <span className="text-green-600">✓ Photo</span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-admin-primary hover:text-admin-primary/80 text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No users pending verification
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verify User
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                {selectedUser.profile?.photos?.[0]?.url ? (
                  <img
                    src={selectedUser.profile.photos[0].url}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                )}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedUser.name || 'No name'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.profile?.country}, {selectedUser.profile?.region}
                  </p>
                </div>
              </div>

              {/* Photos Gallery */}
              {selectedUser.profile?.photos?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Profile Photos
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedUser.profile.photos.map((photo: any, index: number) => (
                      <div key={photo.id} className="relative aspect-square">
                        <img
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Note (Optional)
                </label>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add any notes about this verification..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleVerify(selectedUser.id, false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleVerify(selectedUser.id, true)}
                  className="px-4 py-2 bg-admin-primary hover:bg-admin-primary/90 text-white rounded-md flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
