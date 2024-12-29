// components/Login.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Default Username:', import.meta.env.VITE_DEFAULT_USERNAME)
    console.log('Default Password:', import.meta.env.VITE_DEFAULT_PASSWORD)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const defaultUsername = import.meta.env.VITE_DEFAULT_USERNAME
    const defaultPassword = import.meta.env.VITE_DEFAULT_PASSWORD

    if (username === defaultUsername && password === defaultPassword) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/element-pricing')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Login</Button>
    </form>
  )
}

export default Login
