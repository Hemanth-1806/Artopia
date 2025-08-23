import React from 'react'
import { Link } from 'react-router-dom'
import { Palette, Users, MessageCircle, Camera, Star, ArrowRight } from 'lucide-react'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Artopia</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/auth" 
              className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth" 
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Where Artists
            <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent"> Connect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join a vibrant community of artists, share your creative journey, and discover amazing talent from around the world.
          </p>
          <Link 
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-lg font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard 
            icon={<Camera className="w-8 h-8 text-pink-500" />}
            title="Share Your Art"
            description="Upload and showcase your creative works with beautiful image galleries"
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-indigo-500" />}
            title="Connect with Artists"
            description="Discover and connect with talented artists from diverse creative backgrounds"
          />
          <FeatureCard 
            icon={<MessageCircle className="w-8 h-8 text-pink-500" />}
            title="Real-time Chat"
            description="Collaborate and communicate with fellow artists through instant messaging"
          />
          <FeatureCard 
            icon={<Star className="w-8 h-8 text-indigo-500" />}
            title="Get Verified"
            description="Build your reputation and earn verification badges as you grow your portfolio"
          />
        </div>

        {/* Preview Images */}
        <div className="grid md:grid-cols-3 gap-8">
          <PreviewCard 
            title="Beautiful Profiles"
            description="Showcase your artistic journey with professional-looking profiles"
            gradient="from-pink-200 to-pink-300"
          />
          <PreviewCard 
            title="Inspiring Feed"
            description="Discover amazing artwork in a clean, Instagram-style interface"
            gradient="from-indigo-200 to-indigo-300"
          />
          <PreviewCard 
            title="Mobile First"
            description="Enjoy a seamless experience across all your devices"
            gradient="from-purple-200 to-pink-200"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; 2025 Artopia. Made with ❤️ for artists everywhere.</p>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
)

const PreviewCard = ({ title, description, gradient }) => (
  <div className="group cursor-pointer">
    <div className={`h-48 bg-gradient-to-br ${gradient} rounded-2xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
      <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
        <Palette className="w-8 h-8 text-white" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default Landing