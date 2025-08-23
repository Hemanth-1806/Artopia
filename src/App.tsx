import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Components
import Landing from './components/Landing'
import Auth from './components/Auth'
import Layout from './components/Layout'
import Feed from './components/Feed'
import CreatePost from './components/CreatePost'
import Profile from './components/Profile'
import Chats from './components/Chats'
import ChatDetail from './components/ChatDetail'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

// Public Route Component (redirect to app if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/app" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />
          
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Feed />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="chats" element={<Chats />} />
            <Route path="chats/:chatId" element={<ChatDetail />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App