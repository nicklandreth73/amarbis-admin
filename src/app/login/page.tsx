'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Mail, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  // Debug logging
  useEffect(() => {
    console.log('Login Page - Session status:', status)
    console.log('Login Page - Session data:', session)
  }, [session, status])

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      console.log('User is authenticated and admin, redirecting...')
      window.location.href = '/'
    }
  }, [session, status])

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      if (error === 'CredentialsSignin') {
        toast.error('Invalid credentials or unauthorized access')
      } else if (error === 'SessionRequired') {
        toast.error('Please sign in to continue')
      } else {
        toast.error('An error occurred during authentication')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        toast.error('Invalid credentials or unauthorized access')
        setIsLoading(false)
      } else if (result?.ok) {
        toast.success('Login successful! Redirecting...')
        // Force a hard redirect
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
      setIsLoading(false)
    }
  }

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-admin-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-admin-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Secure access for authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                  placeholder="admin@test.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-admin-primary hover:bg-admin-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Session debug info */}
          <div className="mt-6 space-y-2">
            <div className="text-xs text-gray-500 text-center">
              Status: {status} | Admin: {session?.user?.isAdmin ? 'Yes' : 'No'}
            </div>
            
            {/* Debug links */}
            <div className="flex justify-center space-x-4 text-xs">
              <a href="/api/session" className="text-blue-600 hover:underline" target="_blank">
                Check Session API
              </a>
              <a href="/test" className="text-blue-600 hover:underline">
                Test Page
              </a>
              <a href="/" className="text-blue-600 hover:underline">
                Force Dashboard
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test credentials: admin@test.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
