import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, User } from 'lucide-react'

const Chats = () => {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchChats()
    }
  }, [user])

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          participant_1,
          participant_2,
          updated_at,
          participant_1_profile:profiles!chats_participant_1_fkey(display_name, avatar_url),
          participant_2_profile:profiles!chats_participant_2_fkey(display_name, avatar_url),
          messages(content, created_at)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching chats:', error)
        return
      }

      // Process chats to get the other participant's info
      const processedChats = data.map(chat => {
        const isParticipant1 = chat.participant_1 === user.id
        const otherParticipant = isParticipant1 ? chat.participant_2_profile : chat.participant_1_profile
        const lastMessage = chat.messages?.[chat.messages.length - 1]

        return {
          id: chat.id,
          otherParticipant,
          lastMessage,
          updatedAt: chat.updated_at
        }
      })

      setChats(processedChats)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-500">Start chatting with other artists by visiting their profiles!</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/app/chats/${chat.id}`}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            {/* Avatar */}
            {chat.otherParticipant?.avatar_url ? (
              <img
                src={chat.otherParticipant.avatar_url}
                alt={chat.otherParticipant.display_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {chat.otherParticipant?.display_name || 'Unknown User'}
                </h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessage.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Chats