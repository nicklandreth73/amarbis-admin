'use client'

import { X, Mail, Phone, MapPin, Calendar, Shield, AlertCircle, Heart, Briefcase, Ruler, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { formatJsonArray } from '@/lib/utils/json'

interface UserDetailsModalProps {
  user: any
  onClose: () => void
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
          {/* Basic Info with main photo */}
          <div className="flex items-start space-x-4">
            {user.profile?.photos && user.profile.photos.length > 0 ? (
              <img
                className="h-24 w-24 rounded-full object-cover cursor-pointer"
                src={user.profile.photos[selectedPhotoIndex]?.url}
                alt=""
                onClick={() => setSelectedPhotoIndex(0)}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl text-gray-500 dark:text-gray-400 font-medium">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.profile?.displayName || user.name || 'No name'}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user.id}
              </p>
              {user.verification?.adminVerified && (
                <div className="flex items-center space-x-1 mt-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Admin Verified</span>
                  {user.verification.adminVerifiedAt && (
                    <span className="text-xs text-gray-500">
                      on {format(new Date(user.verification.adminVerifiedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          {user.profile?.photos && user.profile.photos.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Profile Photos ({user.profile.photos.length})
              </h5>
              
              {/* Selected Photo Display */}
              <div className="mb-4">
                <div className="relative aspect-square max-w-md mx-auto">
                  <img
                    src={user.profile.photos[selectedPhotoIndex]?.url}
                    alt={`Selected photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {user.profile.photos[selectedPhotoIndex]?.isPrimary && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      Primary Photo
                    </span>
                  )}
                  {user.profile.photos[selectedPhotoIndex]?.moderationStatus && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                      user.profile.photos[selectedPhotoIndex].moderationStatus === 'APPROVED' ? 'bg-green-600 text-white' :
                      user.profile.photos[selectedPhotoIndex].moderationStatus === 'REJECTED' ? 'bg-red-600 text-white' :
                      user.profile.photos[selectedPhotoIndex].moderationStatus === 'FLAGGED' ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {user.profile.photos[selectedPhotoIndex].moderationStatus}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Photo Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {user.profile.photos.map((photo: any, index: number) => (
                  <div 
                    key={photo.id} 
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden transition-all ${
                      index === selectedPhotoIndex ? 'ring-2 ring-blue-500 scale-95' : 'hover:scale-105'
                    }`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                    {photo.isPrimary && (
                      <span className="absolute top-1 left-1 w-2 h-2 bg-blue-600 rounded-full" title="Primary" />
                    )}
                    <span className="absolute bottom-1 right-1 text-white text-xs bg-black/50 px-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio and Description */}
          {user.profile?.bio && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Bio
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {user.profile.bio}
              </p>
            </div>
          )}

          {/* Profile Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Profile Information
            </h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Personal Info */}
              <div className="space-y-3">
                {user.profile?.age && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Age:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user.profile.age}</span>
                  </div>
                )}
                
                {user.profile?.gender && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Gender:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user.profile.gender}</span>
                  </div>
                )}
                
                {user.profile?.orientation && (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Orientation:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatJsonArray(user.profile.orientation)}
                    </span>
                  </div>
                )}
                
                {user.profile?.height && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Height:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user.profile.height} cm</span>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                {user.profile?.occupation && (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Work:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user.profile.occupation}</span>
                  </div>
                )}
                
                {user.profile?.education && (
                  <div className="flex items-start space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Education:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user.profile.education}</span>
                  </div>
                )}
                
                {user.profile?.interests && (
                  <div className="flex items-start space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Interests:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatJsonArray(user.profile.interests)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle */}
            {(user.profile?.smoking || user.profile?.drinking || user.profile?.exercise) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Lifestyle</h6>
                <div className="grid grid-cols-3 gap-4">
                  {user.profile.smoking && (
                    <div>
                      <span className="text-xs text-gray-500">Smoking:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{user.profile.smoking}</p>
                    </div>
                  )}
                  {user.profile.drinking && (
                    <div>
                      <span className="text-xs text-gray-500">Drinking:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{user.profile.drinking}</p>
                    </div>
                  )}
                  {user.profile.exercise && (
                    <div>
                      <span className="text-xs text-gray-500">Exercise:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{user.profile.exercise}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact & Location */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Contact & Location
            </h5>
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
              {user.profile?.country && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.profile.locationName || `${user.profile.country}${user.profile.region ? ', ' + user.profile.region : ''}`}
                    </p>
                    {user.profile.latitude && user.profile.longitude && (
                      <p className="text-xs text-gray-500">
                        GPS: {user.profile.latitude.toFixed(4)}, {user.profile.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Visibility</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.profile?.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.profile?.completionScore || 0}%
                </span>
              </div>
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
                    {user.subscription.tier} ({user.subscription.status})
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
                    {user.verification.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Photo</span>
                  <span className={`text-sm font-medium ${user.verification.photoVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.photoVerified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Admin</span>
                  <span className={`text-sm font-medium ${user.verification.adminVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.adminVerified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ID</span>
                  <span className={`text-sm font-medium ${user.verification.idVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {user.verification.idVerified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trust Score</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.verification.trustScore.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.verification.verificationLevel}
                  </span>
                </div>
              </div>
              {user.verification.adminVerificationNote && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Admin Note</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {user.verification.adminVerificationNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Account History
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(user.createdAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(user.updatedAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {user.emailVerified && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email Verified</span>
                  <span className="text-gray-900 dark:text-white">
                    {format(new Date(user.emailVerified), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
