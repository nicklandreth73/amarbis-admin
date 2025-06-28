'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function TestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Session Test Page</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p>Status: <strong>{status}</strong></p>
          <p>Logged In: <strong>{session ? 'Yes' : 'No'}</strong></p>
          <p>Is Admin: <strong>{session?.user?.isAdmin ? 'Yes' : 'No'}</strong></p>
        </div>

        {session && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold mb-2">User Info</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        )}

        <div className="space-x-4">
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/login"
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
