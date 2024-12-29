// components/AuthWrapper.tsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication status from localStorage
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated')
      setIsAuthenticated(auth === 'true')
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login')
    }
  }, [isAuthenticated, location, navigate])

  // If not authenticated and not on login page, don't render children
  if (!isAuthenticated && location.pathname !== '/login') {
    return null
  }

  return <>{children}</>
}

export default AuthWrapper
