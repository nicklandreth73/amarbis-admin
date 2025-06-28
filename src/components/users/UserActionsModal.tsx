'use client'

import { useState } from 'react'
import { X, Ban, CheckCircle, Key, Mail, Trash2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserActionsModalProps {
  user: any
  onClose: () => void
  onAction: (action: string, data?: any) => void
}

export function UserActionsModal({ user, onClose, onAction }: UserActionsModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showVerifyForm, setShowVerifyForm] = useState(false)
  const [verificationNote, setVerificationNote] = useState('')

  const handleAction = async (actionId: string, data?: any) => {
    if (actionId === 'delete' && !confirmDelete) {
      setConfirmDelete(true)
      return
    }

    if (actionId === 'verify' && !showVerifyForm) {
      setShowVerifyForm(true)
      return
    }

    // Show loading toast
    const loadingToast = toast.loading(`Processing ${actionId}...`)
    
    try {
      await onAction(actionId, data)
      toast.dismiss(loadingToast)
      
      // Success messages
      const successMessages: Record<string, string> = {
        'verify': user.verification?.adminVerified ? 'Verification removed' : 'User verified successfully',
        'ban': 'User banned successfully',
        'unban': 'User unbanned successfully',
        'reset-password': 'Password reset successfully',
        'delete': 'User deleted successfully',
        'send-email': 'Email sent successfully'
      }
      
      toast.success(successMessages[actionId] || 'Action completed')
      onClose()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(`Failed to ${actionId}`)
    }
  }

  const actions = [
    {
      id: 'verify',
      label: user.verification?.adminVerified ? 'Already Verified' : 'Admin Verify User',
      icon: Shield,
      color: user.verification?.adminVerified ? 'text-gray-400' : 'text-blue-600',
      description: user.verification?.adminVerified 
        ? 'This user has been verified by an admin'
        : 'Manually verify this user and show verified badge',
      disabled: user.verification?.adminVerified
    },
    {
      id: user.banned ? 'unban' : 'ban',
      label: user.banned ? 'Unban User' : 'Ban User',
      icon: Ban,
      color: user.banned ? 'text-green-600' : 'text-red-600',
      description: user.banned 
        ? 'Restore access to this user\'s account' 
        : 'Prevent this user from accessing their account'
    },
    {
      id: 'reset-password',
      label: 'Reset Password',
      icon: Key,
      color: 'text-purple-600',
      description: 'Send a password reset email to the user'
    },
    {
      id: 'send-email',
      label: 'Send Email',
      icon: Mail,
      color: 'text-blue-600',
      description: 'Send a custom email to this user'
    },
    {
      id: 'delete',
      label: 'Delete Account',
      icon: Trash2,
      color: 'text-red-600',
      description: 'Permanently delete this user\'s account and data'
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Actions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name || 'No name'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>

        <div className="space-y-2">
          {!confirmDelete && !showVerifyForm ? (
            actions.map((action) => (
              <button
                key={action.id}
                onClick={() => !action.disabled && handleAction(action.id)}
                disabled={action.disabled}
                className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                  action.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                <action.icon className={`w-5 h-5 mt-0.5 ${action.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </button>
            ))
          ) : confirmDelete ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  Are you sure you want to delete this user?
                </p>
                <p className="text-xs text-red-700 dark:text-red-200">
                  This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('delete')}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Yes, Delete User
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : showVerifyForm ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {user.verification?.adminVerified ? 'Remove Admin Verification' : 'Add Admin Verification'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-200">
                  {user.verification?.adminVerified 
                    ? 'This will remove the verified badge from the user profile.'
                    : 'This will add a verified badge to the user profile.'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Note (Optional)
                </label>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('verify', { note: verificationNote })}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  {user.verification?.adminVerified ? 'Remove Verification' : 'Verify User'}
                </button>
                <button
                  onClick={() => {
                    setShowVerifyForm(false)
                    setVerificationNote('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
