import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, MapPin, Palette, Star, MessageSquare, Edit, Camera } from 'lucide-react'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser, profile: currentProfile, updateProfile } = useAuth()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    location: '',
    artforms: ''
  })

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id)
  const targetUserId = userId || currentUser?.id

  useEffect(() => {
    if (targetUserId) {
      fetchProfile()
      fetchPosts()
    }
  }, [targetUserId])

  const fetchProfile = async () => {
    try {
      if (isOwnProfile && currentProfile) {
        setProfile(currentProfile)
        setEditData({
          display_name: currentProfile.display_name || '',
          bio: currentProfile.bio || '',
          location: currentProfile.location || '',
          artforms: currentProfile.artforms || ''
        })
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          return
        }

        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async () => {
    if (!currentUser || !profile || isOwnProfile) return

    // Create deterministic chat ID
    const chatId = [currentUser.id, profile.id].sort().join('_')

    try {
      // Check if chat exists or create it
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('id', chatId)
        .single()

      if (!existingChat) {
        // Create new chat
        await supabase
          .from('chats')
          .insert({
            id: chatId,
            participant_1: currentUser.id,
            participant_2: profile.id
          })
      }

      navigate(`/app/chats/${chatId}`)
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!isOwnProfile) return

    try {
      const { error } = await updateProfile(editData)
      if (error) {
        console.error('Profile update error:', error)
        return
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    )
  }

  const isVerified = posts.length >= 4

  return (
    <div className="max-w-md mx-auto">
      {/* Profile Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{profile.display_name}</h1>
              {isVerified && (
                <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              {profile.artforms && (
                <div className="flex items-center gap-1">
                  <Palette className="w-4 h-4" />
                  {profile.artforms}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleStartChat}
                className="p-2 text-pink-500 hover:text-pink-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-700 mt-4 leading-relaxed">{profile.bio}</p>
        )}

        {/* Post Count */}
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-gray-900">{posts.length}</span>
          <span className="text-gray-500 ml-2">{posts.length === 1 ? 'post' : 'posts'}</span>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && isOwnProfile && (
        <div className="bg-white border-b border-gray-100 p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={editData.display_name}
                onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Tell us about your artistic journey..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Art Forms</label>
              <input
                type="text"
                value={editData.artforms}
                onChange={(e) => setEditData(prev => ({ ...prev, artforms: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Digital Art, Photography, etc."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      <div className="p-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">
              {isOwnProfile ? 'Share your first artwork!' : 'No posts yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square">
                <img
                  src={post.image_url}
                  alt={post.caption}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile