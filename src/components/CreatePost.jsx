import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, X } from 'lucide-react'
import { supabase, uploadImage } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const CreatePost = () => {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image || !user) return

    setLoading(true)
    setError('')

    try {
      // Upload image
      const { data: imageData, error: uploadError } = await uploadImage(image, 'posts')
      
      if (uploadError) {
        throw new Error('Failed to upload image: ' + uploadError.message)
      }

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: imageData.url,
          image_path: imageData.path,
          caption: caption.trim()
        })

      if (postError) {
        throw new Error('Failed to create post: ' + postError.message)
      }

      // Navigate back to feed
      navigate('/app')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setImage(null)
    setPreview(null)
    // Reset file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Share Your Art</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            {!preview ? (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Caption (Optional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share the story behind your artwork..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {caption.length}/500
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!image || loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Share Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost