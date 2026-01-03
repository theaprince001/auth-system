// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, saveAuthData, getCurrentUser, isAuthenticated, clearAuthData } from '../utils/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user exists in localStorage on mount
    const storedUser = getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  // src/hooks/useAuth.js - Updated with debug logs
  const login = async (email, password) => {
    setLoading(true)
    setError('')
    
    try {
      console.log('1. Sending login request for:', email)
      const response = await authAPI.login({ email, password })
      console.log('2. Login response:', response)
      
      if (response.token) {
        console.log('3. Token received:', response.token.substring(0, 20) + '...')
        
        const userData = {
          name: response.name,
          email: response.email
        }
        
        console.log('4. User data:', userData)
        
        // Save to localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        console.log('5. localStorage after save:')
        console.log('   - token saved:', localStorage.getItem('token') !== null)
        console.log('   - user saved:', localStorage.getItem('user') !== null)
        
        // Update state
        setUser(userData)
        
        console.log('6. State updated, navigating to dashboard...')
        
        // SOLUTION: Force navigation and reload
        navigate('/dashboard', { replace: true })
        
        // Force a state update by changing the URL
        window.location.href = '/dashboard'
        
        return { success: true }
      } else {
        console.log('3. NO TOKEN in response!')
        throw new Error('No token in response')
      }
    } catch (err) {
      console.error('7. Login error:', err)
      const errorMsg = err.response?.data || err.message || 'Login failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register({ name, email, password })
      navigate('/login')
      return { success: true, message: response }
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Registration failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuthData()
    setUser(null)
    setError(null)
    navigate('/login')
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    setError
  }
}