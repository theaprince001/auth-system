import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, clearAuthData } from '../utils/auth'
import Button from '../components/Button'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Get user only once on component mount
  useEffect(() => {
    if (isLoggingOut) return
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
    
    // Redirect if no user
    if (!currentUser) {
      navigate('/login', { replace: true })
    }
  }, [isLoggingOut])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect from useEffect
  }

  const handleLogout = () => {
    setIsLoggingOut(true)
    clearAuthData()
    navigate('/login', { replace: true })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">Account Status</h3>
              <p className="text-3xl font-bold text-blue-600">Active</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">Last Login</h3>
              <p className="text-3xl font-bold text-green-600">Now</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="font-semibold text-purple-800 mb-2">Member Since</h3>
              <p className="text-3xl font-bold text-purple-600">Today</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary">Edit Profile</Button>
              <Button variant="secondary">Change Password</Button>
              <Button variant="secondary">View Activity</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard