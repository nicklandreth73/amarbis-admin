'use client'

import { X, Mail, Phone, MapPin, Calendar, Shield, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface UserDetailsModalProps {
  user: any
  onClose: () => void
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              User Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-4">
            {user.profile?.photos?.[0]?.url ? (
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={user.profile.photos[0].url}
                alt=""
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl text-gray-500 dark:text-gray-400 font-medium">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.name || 'No name'}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user.id}
              </p>
              {user.verification?.adminVerified && (
                <div className="flex items-center space-x-1 mt-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Admin Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Location & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.profile?.country && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.profile.locationName || `${user.profile.country}, ${user.profile.region}`}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Account Status
            </h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className={`text-sm font-medium ${user.banned ? 'text-red-600' : 'text-green-600'}`}>
                  {user.banned ? 'Banned' : 'Active'}
                </span>
              </div>
              {user.banned && user.banReason && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-600 font-medium">Ban Reason</p>
                    <p className="text-sm text-red-800 dark:text-red-200">{user.banReason}</p>
                    {user.bannedAt && (
                      <p className="text-xs text-red-600 mt-1">
                        Banned on {format(new Date(user.bannedAt), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Active</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {format(new Date(user.lastSeen), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {user.lastIp && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last IP</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {user.lastIp}
                  </span>
                </div>
              )}
              {user.subscription && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subscription</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.subscription.tier}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          {user.verification && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Verification Status
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  <span className={`text-sm font-medium ${user.verification.emailVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.emailVerified ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Photo</span>
                  <span className={`text-sm font-medium ${user.verification.photoVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.photoVerified ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Admin</span>
                  <span className={`text-sm font-medium ${user.verification.adminVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.adminVerified ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trust Score</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.verification.trustScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
