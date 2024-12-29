/* src/routes.tsx */
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Login from './components/Login'
import ElementPricingCalculator from './components/ElementPricingCalculator'
import ProtectedRoute from './components/ProtectedRoute'
import App from './App'

const AppRoutes: React.FC = () => {
  const isAuthenticated = () =>
    localStorage.getItem('isAuthenticated') === 'true'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/element-pricing"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated()}>
              <ElementPricingCalculator />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
