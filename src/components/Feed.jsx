import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { User } from 'lucide-react'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url
          )
        `)
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

  const handleAuthorClick = (userId) => {
    navigate(`/app/profile/${userId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-6">Be the first to share your amazing artwork!</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Instagram-style Grid */}
      <div className="grid grid-cols-1 gap-4 p-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Author overlay - bottom left */}
              <button
                onClick={() => handleAuthorClick(post.profiles.id)}
                className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-black/60 transition-all"
              >
                {post.profiles.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.display_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                {post.profiles.display_name}
              </button>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className="p-4">
                <p className="text-gray-800 leading-relaxed">{post.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feed