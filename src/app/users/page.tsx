'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { UserSearch } from '@/components/users/UserSearch'
import { UserTable } from '@/components/users/UserTable'
import { UserFilters } from '@/components/users/UserFilters'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    verified: 'all',
    status: 'all',
    subscription: 'all',
    hasPhotos: 'with-photos', // Default to users with photos
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search, view, and manage user accounts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <UserSearch 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div>
            <UserFilters 
              filters={filters}
              onChange={setFilters}
            />
          </div>
        </div>

        <UserTable 
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </DashboardLayout>
  )
}
