// src/utils/auth.js
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/register', userData)
    return response.data
  },
  
  login: async (credentials) => {
    console.log('API: Sending login request to backend...')
    try {
      const response = await api.post('/login', credentials)
      console.log('API: Login response received:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Login error:', error.response?.data || error.message)
      throw error
    }
  },
  
  logout: () => {
    clearAuthData()
  },
  
  test: async () => {
    const response = await api.get('/test')
    return response.data
  }
}

// Get current user
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null
    }
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user data:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return null
  }
}

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const user = getCurrentUser()
  return !!token && !!user
}

// Save auth data
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Validate token (optional)
export const validateToken = (token) => {
  if (!token) return false
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    const expiry = payload.exp * 1000
    const now = Date.now()
    
    return expiry > now
  } catch {
    return false
  }
}