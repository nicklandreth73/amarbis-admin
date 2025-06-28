'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SimpleDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.isAdmin) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
          <p>You are logged in as: <strong>{session.user.email}</strong></p>
          <p>Admin status: <strong>{session.user.isAdmin ? 'Yes' : 'No'}</strong></p>
        </div>

        <div className="space-x-4">
          <a 
            href="/users"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Manage Users
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
