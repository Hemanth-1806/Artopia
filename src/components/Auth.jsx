import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Palette, Mail, Lock, User, ArrowLeft } from 'lucide-react'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        if (!formData.displayName.trim()) {
          setError('Display name is required')
          return
        }
        const { error } = await signUp(formData.email, formData.password, formData.displayName)
        if (error) throw error
        navigate('/app')
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) throw error
        navigate('/app')
      }
    } catch (error) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to Landing */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Join Artopia' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp 
                ? 'Create your artist account and start sharing' 
                : 'Sign in to your account to continue'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your artist name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign Up/In */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setFormData({ email: '', password: '', displayName: '' })
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth